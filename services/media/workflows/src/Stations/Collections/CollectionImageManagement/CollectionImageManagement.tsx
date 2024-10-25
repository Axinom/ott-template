import React from 'react';
import { useParams } from 'react-router-dom';
import { CollectionImageManagementForm } from './CollectionImageManagementForm';

interface UrlParams {
  collectionId: string;
}

export const CollectionImageManagement: React.FC = () => {
  const { collectionId } = useParams<UrlParams>();

  return <CollectionImageManagementForm collectionId={Number(collectionId)} />;
};
