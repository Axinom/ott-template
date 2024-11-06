import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonImageManagementForm } from './SeasonImageManagementForm';

interface UrlParams {
  seasonId: string;
}

export const SeasonImageManagement: React.FC = () => {
  const { seasonId } = useParams<UrlParams>();

  return <SeasonImageManagementForm seasonId={Number(seasonId)} />;
};
