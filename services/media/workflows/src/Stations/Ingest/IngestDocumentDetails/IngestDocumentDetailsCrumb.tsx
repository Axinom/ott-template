import { BreadcrumbResolver } from '@axinom/mosaic-portal';
import { client } from '../../../apolloClient';
import {
  IngestDocumentTitleDocument,
  IngestDocumentTitleQuery,
} from '../../../generated/graphql';

export const IngestDocumentDetailsCrumb: BreadcrumbResolver = (params) => {
  return async (): Promise<string> => {
    const response = await client.query<IngestDocumentTitleQuery>({
      query: IngestDocumentTitleDocument,
      variables: {
        id: Number(params['ingestId']),
      },
      errorPolicy: 'ignore',
    });
    return response.data.ingestDocument?.title ?? 'Ingest Document';
  };
};
