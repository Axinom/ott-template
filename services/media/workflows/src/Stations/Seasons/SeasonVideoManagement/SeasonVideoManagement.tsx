import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonVideoManagementForm } from './SeasonVideoManagementForm';

interface UrlParams {
  seasonId: string;
}

export const SeasonVideoManagement: React.FC = () => {
  const { seasonId } = useParams<UrlParams>();

  return <SeasonVideoManagementForm seasonId={Number(seasonId)} />;
};
