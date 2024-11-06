import React from 'react';
import { useParams } from 'react-router-dom';
import { IngestDocumentDetailsForm } from './IngestDocumentDetailsForm';

interface UrlParams {
  ingestId: string;
}

export const IngestDocumentDetails: React.FC = () => {
  const { ingestId } = useParams<UrlParams>();

  return <IngestDocumentDetailsForm ingestId={Number(ingestId)} />;
};
