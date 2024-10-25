import React from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeVideoManagementForm } from './EpisodeVideoManagementForm';

interface UrlParams {
  episodeId: string;
}

export const EpisodeVideoManagement: React.FC = () => {
  const { episodeId } = useParams<UrlParams>();

  return <EpisodeVideoManagementForm episodeId={Number(episodeId)} />;
};
