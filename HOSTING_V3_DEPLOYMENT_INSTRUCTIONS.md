# Steps

Run the following commands on the root of the monorepo

## Notes

- Update the root .env to refer to the Canary Environment
  - The env-var values can be found inside the BW Entry
    `TEST - Canary Environment Root Variables`
- Change the value of the repository name (i.e. `emperorrxf/media-service`) to
  the corresponding value in all the commands written below.
- After running the `docker build` & `docker push` commands for each service,
  change the root package.json's `@axinom/mosaic-cli` version to the latest
  version available (i.e. `"@axinom/mosaic-cli": "0.39.0"`) and run
  `yarn install`
  - The docker build commands need the older version
  - The Mosaic CLI commands used to deploy the service need the newer version :)
- Then use the `yarn quick-deploy` script from the root package to deploy the
  three services by providing the tag `canary-image` manually

## Media Service

- `docker build -t emperorrxf/media-service:canary-image --build-arg PACKAGE_ROOT=services/catalog/service --build-arg PACKAGE_BUILD_COMMAND=build:catalog-service:prod --platform linux/amd64 .`

- `docker push emperorrxf/media-service:canary-image`

## Catalog Service

- `docker build -t emperorrxf/catalog-service:canary-image --build-arg PACKAGE_ROOT=services/catalog/service --build-arg PACKAGE_BUILD_COMMAND=build:catalog-service:prod --platform linux/amd64 .`

- `docker push emperorrxf/catalog-service:canary-image`

## Entitlement Service

- `docker build -t emperorrxf/entitlement-service:canary-image --build-arg PACKAGE_ROOT=services/entitlement/service --build-arg PACKAGE_BUILD_COMMAND=build:entitlement-service:prod --platform linux/amd64 .`

- `docker push emperorrxf/entitlement-service:canary-image`
