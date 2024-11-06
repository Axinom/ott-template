import React from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeImageManagementForm } from './EpisodeImageManagementForm';

interface UrlParams {
  episodeId: string;
}

export const EpisodeImageManagement: React.FC = () => {
  const { episodeId } = useParams<UrlParams>();

  return <EpisodeImageManagementForm episodeId={Number(episodeId)} />;
};
