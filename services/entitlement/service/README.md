# Entitlement Service

## Overview

This is the backend service with a focus on checking wether a client is entitled
to playback videos. It uses PostgreSQL as a database and PostGraphile as the
GraphQL API engine

## License note

This service uses the geoip-country npm package to lookup country codes based on
the IP address of the user to determine if the movie or episode has a valid
playback license. This library, in turn, uses a MaxMind (https://www.maxmind.com
) GeoLite2 Free Geolocation Data internally. This database is free but has
certain licensing conditions that you should follow. Most notable are providing
attribution to MaxMind (same as the reference to their website above) and
keeping the geolocation databases up-to-date. This can be done by periodically
updating the geoip-country npm package or by specifying a GeoLite2 license key
in the GEOLITE2_LICENSE_KEY env variable. This will enable automatic DB updates
during service runtime. Please have a look at their EULA
(https://www.maxmind.com/en/geolite2/eula ).

## Setup and Startup

- Check the root `README.md` file and follow the setup instructions.
- Potential customizations/deviations: check the file `.env` and modify any of
  the variables that might be different in your development environment.
  - Get the values for Communication Key and Communication Key ID from
    https://portal.axinom.com.
    - Select DRM, go to "My DRM" (top right corner)
    - Select your Evaluation or Production account.
    - Under "API CONFIG" inside of the "License Service config" section find
      both values.
  - Sign up for a free GeoLite2 account at
    https://dev.maxmind.com/geoip/geolite2-free-geolocation-data, generate a
    license key and set it as the value for the GEOLITE2_LICENSE_KEY. If your
    service(s) run into the Maxmind daily download limit you can set up your own
    GEO database (proxy) cache or repository. You can set the URL to this
    service/DB as the `GEOLITE2_DOWNLOAD_URL` in your environment variables.
  - (Optionally) run `yarn setup:webhooks` to generate webhook secrets and set
    related values in `.env` file. This will enable `/entitlement` and
    `/manifest` webhook endpoints to be able to authenticate requests.
- Run `yarn dev` to start (only) this service. Otherwise run `yarn dev:services`
  on the root to start all backend services.
- For more info on working with database migrations see
  [the corresponding `README`](../service/migrations/README.md).

## Development and Testing notes

The service has one API endpoint `entitlement` and it expects catalog service to
be running and to have published movies or episodes with protected videos
associated with them. In addition to that, `entitlement` service will try to
determine the current country of the user, based on his IP address and this
country will be used to check if a movie or episode has a valid license. During
development and in a test environment, it might be desirable to simulate the
behavior of being located in different countries and test license validation
logic for licenses that have different country codes.

To do this, `MOSAIC_TESTING_IP_ENABLED` can be used. Setting this flag to true
allows to pass any IP address (v4 or v6) as a custom header, and that value will
override the actual IP. To summarize, GraphQL request can look like this:

```
query Entitlement {
  entitlement(input: { entityId: "movie-1" }) {
    entitlementMessageJwt
  }
}
```

And passed with headers like this:

```
{
  "Authorization": "Bearer jwt_value_placeholder",
  "mosaic-testing-ip":"2a05:4f46:c14:5700:fcee:3dcb:301c:fed5"
}
```

Different IP address ranges for specific countries can be found in google. To
get the jwt value during development, `yarn util:token` can be executed.

## Setting up webhook secrets for production environment

The `yarn setup:webhooks` script is used for development environments. To get
the values for `ENTITLEMENT_WEBHOOK_SECRET` and `MANIFEST_WEBHOOK_SECRET` env
variables for the production environment, the following mutation must be
launched against the Video Service GraphQL API. You can use GraphiQL UI for that
(https://video.service.eu.axinom.net/graphiql):

```
  mutation GenerateSecrets {
    generateEntitlementWebhookSecret {
      secret
    }
    generateManifestWebhookSecret {
      secret
    }
  }
```

To authenticate the request, you would need an appropriate JWT. To get the JWT -
the Portal Admin UI can be used (https://admin.service.eu.axinom.com). You would
need to create or use an existing service account for your environment, make
sure it has `Settings: Edit` permission for the Video Service, and generate a
JWT on a dedicated `Access Token` station. More info here:
https://docs.axinom.com/platform/core/identity/authenticate-serviceaccount
