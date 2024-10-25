import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { IngestDocumentsData } from '../IngestDocumentsExplorer/IngestDocuments.types';
import { IngestDocumentDetailsForm } from './IngestDocumentDetailsForm';

export const IngestDocumentDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<IngestDocumentsData>>(QuickEditContext);

  return <IngestDocumentDetailsForm ingestId={selectedItem.id} />;
};
