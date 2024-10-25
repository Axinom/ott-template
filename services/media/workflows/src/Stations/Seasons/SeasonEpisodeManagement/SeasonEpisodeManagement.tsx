import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonEpisodeManagementForm } from './SeasonEpisodeManagementForm';

interface UrlParams {
  seasonId: string;
}

export const SeasonEpisodeManagement: React.FC = () => {
  const { seasonId } = useParams<UrlParams>();

  return <SeasonEpisodeManagementForm seasonId={Number(seasonId)} />;
};
