import {
  DeclareCuePointTypesCommand,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { Config, requestServiceAccountToken } from '../common';

export const videoCuePointTypes = [
  { key: 'INTRO_END', title: 'Intro end' },
  { key: 'CHAPTER_MARKER', title: 'Chapter marker' },
  { key: 'OUTRO_START', title: 'Outro start' },
];

export const registerVideoCuePointTypes = async (
  storeOutboxMessage: StoreOutboxMessage,
  loginClient: ClientBase,
  config: Config,
): Promise<void> => {
  const accessToken = await requestServiceAccountToken(config);
  await storeOutboxMessage<DeclareCuePointTypesCommand>(
    config.environmentId,
    VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes,
    {
      service_id: config.serviceId,
      cue_point_types: videoCuePointTypes,
    },
    loginClient,
    {
      envelopeOverrides: {
        auth_token: accessToken,
      },
      options: {
        routingKey:
          VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes.getEnvironmentRoutingKey(
            {
              tenantId: config.tenantId,
              environmentId: config.environmentId,
            },
          ),
      },
    },
  );
};
