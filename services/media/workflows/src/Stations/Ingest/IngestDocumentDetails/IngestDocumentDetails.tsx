import React from 'react';
import { useParams } from 'react-router-dom';
import { IngestDocumentDetailsForm } from './IngestDocumentDetailsForm';

export const IngestDocumentDetails: React.FC = () => {
  const ingestId = Number(
    useParams<{
      ingestId: string;
    }>().ingestId,
  );

  return <IngestDocumentDetailsForm ingestId={ingestId} />;
};
