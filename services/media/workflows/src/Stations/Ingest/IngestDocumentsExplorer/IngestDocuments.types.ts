import { IngestDocumentsQuery } from '../../../generated/graphql';

export type IngestDocumentsData = NonNullable<
  IngestDocumentsQuery['filtered']
>['nodes'][number];
