import {
  createLogicalReplicationService,
  CreatePostgresPoolConnectivityMetric,
  ensureReplicationSlotAndPublicationExist,
  getLoginPgPool,
  setupLoginPgPool,
  setupOwnerPgPool,
} from '@axinom/mosaic-db-common';
import {
  AuthenticationConfig,
  setupManagementAuthentication,
  setupManagementGQLSubscriptionAuthentication,
} from '@axinom/mosaic-id-guard';
import { CreateRabbitMQConnectivityMetric } from '@axinom/mosaic-message-bus';
import {
  closeHttpServer,
  handleGlobalErrors,
  isServiceAvailable,
  Logger,
  MosaicErrors,
  setupGlobalConsoleOverride,
  setupGlobalLogMiddleware,
  setupGlobalSkipMaskMiddleware,
  setupHttpServerWithWebsockets,
  setupLivenessAndReadiness,
  setupMonitoring,
  setupServiceHealthEndpoint,
  setupShutdownActions,
  tenantEnvironmentIdsLogMiddleware,
  trimErrorsSkipMaskMiddleware,
} from '@axinom/mosaic-service-common';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import {
  applyMigrations,
  getFullConfig,
  PG_LOCALIZATION_PUBLICATION,
} from './common';
import { localizationTableNames } from './domains/localization-table-names';
import { syncPermissions } from './domains/permission-definition';
import { populateSeedData } from './domains/populate-seed-data';
import { registerImageTypes } from './domains/register-image-types';
import { registerLocalizationEntityDefinitions } from './domains/register-localization-entity-definitions';
import { registerVideoCuePointTypes } from './domains/register-video-cue-point-types';

import { syncSourcesWithLocalization } from './domains/sync-sources-with-localization';
import { setupPostGraphile } from './graphql/postgraphile-middleware';
import { registerMessaging } from './messaging/register-messaging';

// Create the default logger instance to log the application bootstrap sequence and pass to downstream components (where it makes sense).
const logger = new Logger({ context: 'bootstrap' });

// Entry point for the service. Here you configure and register all middlewares and other subsystems.
async function bootstrap(): Promise<void> {
  // Adds `on` handlers for `uncaughtException` and `unhandledRejection` events of node process.
  // Logs all caught errors with log level FATAL, exiting the node process with code 1.
  handleGlobalErrors(logger);
  // Enable a global logging middleware that skips certain logs from having their log values masked (skip false positives).
  // A different middleware can be used in every logger instance where needed.
  setupGlobalSkipMaskMiddleware(trimErrorsSkipMaskMiddleware);
  // Override console calls (mainly from other 3-d party libs) to log them using mosaic logger in a JSON format.
  setupGlobalConsoleOverride(logger);
  // Create an Express application instance that will be running this service.
  const app = express();
  // Create a config object.
  const config = getFullConfig();

  // Set middleware that modifies resulting log object, e.g. adding tenantId and
  // environmentId to details
  setupGlobalLogMiddleware([tenantEnvironmentIdsLogMiddleware(config)]);
  const authConfig: AuthenticationConfig = {
    tenantId: config.tenantId,
    environmentId: config.environmentId,
    authEndpoint: config.idServiceAuthBaseUrl,
  };
  // Create a HTTP server with all WebSocket middleware registered, needed for GQL subscriptions.
  const httpServer = setupHttpServerWithWebsockets(
    app,
    logger,
    setupManagementGQLSubscriptionAuthentication(authConfig),
  );
  // Set up liveness and readiness probe endpoints for Kubernetes.
  const { readiness } = setupLivenessAndReadiness(config);

  // Check ID service is available
  if (!(await isServiceAvailable(config.idServiceAuthBaseUrl))) {
    throw new Error(
      'The Mosaic Identity Service is required to run this service, but it was not available.',
    );
  }

  // Register service health endpoint
  setupServiceHealthEndpoint(app);

  // Enable multipart request support for GQL to support file upload.
  app.use(graphqlUploadExpress());

  // Register shutdown actions. These actions will be performed on service shutdown; in the order of registration.
  const shutdownActions = setupShutdownActions(app, logger);
  // Create environment owner connection pool (internal use).
  const ownerPool = setupOwnerPgPool(
    app,
    config.dbOwnerConnectionString,
    logger,
    shutdownActions,
  );
  // Create login connection pool (used by service components, including PostGraphile).
  setupLoginPgPool(
    app,
    config.dbLoginConnectionString,
    logger,
    shutdownActions,
  );

  // Run database migrations to the latest committed state.
  await applyMigrations(config);
  if (config.isLocalizationEnabled) {
    // Make sure logical replication slot and publication already exist or create them.
    await ensureReplicationSlotAndPublicationExist({
      replicationPgPool: ownerPool,
      replicationSlotName: config.dbLocalizationReplicationSlot,
      publicationName: PG_LOCALIZATION_PUBLICATION,
      tableNames: localizationTableNames,
      schemaName: 'app_public',
      logger,
    });
  }

  // Sync defined permissions to the ID service.
  await syncPermissions(config, logger);

  // Configure messaging: subscribe to topics, create queues, register handlers.
  const broker = await registerMessaging(app, config, logger);

  // Configure metrics endpoint for Prometheus.
  setupMonitoring(config, {
    metrics: [
      CreatePostgresPoolConnectivityMetric(getLoginPgPool(app), 'loginPool'),
      CreateRabbitMQConnectivityMetric(broker),
    ],
  });

  // Register image types used in the media service.
  await registerImageTypes(broker, config);

  // Register video cue point types used in media service.
  await registerVideoCuePointTypes(broker, config);

  if (config.isLocalizationEnabled) {
    // Register localization entity definitions for the media service localizable entities.
    await registerLocalizationEntityDefinitions(broker, config);

    // Starting up the logical replication service to monitor and handle changes
    // on tables related to passed publications
    const shutdown = await createLogicalReplicationService({
      connectionString: config.dbOwnerReplicationConnectionString,
      publicationNames: [PG_LOCALIZATION_PUBLICATION],
      replicationSlotName: config.dbLocalizationReplicationSlot,
      messageHandler: syncSourcesWithLocalization(ownerPool, broker, config),
      logger: new Logger({ context: 'LocalizationLogicalReplication' }),
    });
    shutdownActions.push(shutdown);
  }

  // Populate the DB with some initial seed data
  await populateSeedData(app, logger);

  // Enable authentication middleware for all requests to /graphql.
  setupManagementAuthentication(app, ['/graphql'], authConfig);

  // Configure the PostGraphile middleware. PostGraphile generates a GraphQL API from the underlying Postgres DB.
  await setupPostGraphile(app, config, authConfig);

  // Add our (already configured) application to the HTTP server.
  httpServer.addListener('request', app);

  // Start the HTTP server.
  httpServer.listen(config.port, () => {
    if (config.isDev) {
      logger.log({
        message: 'Altair client can be used to upload files',
        details: {
          graphiql: `http://localhost:${config.port}/graphiql`,
          altair: `http://localhost:${config.port}/altair`,
        },
      });
    } else {
      logger.log('App is ready!');
    }

    // If we got this far we can probably conclude that the service is ready to receive requests.
    readiness.setState(true);
  });

  // The last shutdown action should be closing the HTTP server.
  shutdownActions.push(closeHttpServer(httpServer, logger));
}

// Start the application or crash and burn.
bootstrap().catch((error) => {
  logger.fatal(error, { details: { code: MosaicErrors.StartupError.code } });
  process.exit(-1);
});
