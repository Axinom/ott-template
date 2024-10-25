import { PiletApi } from '@axinom/mosaic-portal';
import React from 'react';
import { MediaIconName } from '../../MediaIcons';
import { MediaIcons } from '../../MediaIcons/MediaIcons';
import { IngestDocumentDetails } from './IngestDocumentDetails/IngestDocumentDetails';
import { IngestDocumentDetailsCrumb } from './IngestDocumentDetails/IngestDocumentDetailsCrumb';
import { IngestDocuments } from './IngestDocumentsExplorer/IngestDocuments';
import { IngestDocumentUpload } from './IngestDocumentUpload/IngestDocumentUpload';

export function register(app: PiletApi): void {
  const ingestNav = {
    name: 'ingest',
    path: '/ingest',
    label: 'Ingest',
    icon: <MediaIcons icon={MediaIconName.Ingest} />,
  };
  app.registerTile(
    {
      ...ingestNav,
      kind: 'home',
      type: 'small',
    },
    false,
  );

  app.registerNavigationItem({
    ...ingestNav,
    categoryName: 'Processing',
  });

  app.registerPage('/ingest', IngestDocuments, {
    breadcrumb: () => 'Ingest Explorer',
    permissions: { 'media-service': ['ADMIN', 'INGESTS_EDIT', 'INGESTS_VIEW'] },
  });

  app.registerPage('/ingest/upload/', IngestDocumentUpload, {
    breadcrumb: () => 'Upload',
    permissions: { 'media-service': ['ADMIN', 'INGESTS_EDIT', 'INGESTS_VIEW'] },
  });

  app.registerPage('/ingest/:ingestId', IngestDocumentDetails, {
    breadcrumb: IngestDocumentDetailsCrumb,
    permissions: { 'media-service': ['ADMIN', 'INGESTS_EDIT', 'INGESTS_VIEW'] },
  });
}
