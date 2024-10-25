import React from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeDetailsForm } from './EpisodeDetailsForm';

interface UrlParams {
  episodeId: string;
}

export const EpisodeDetails: React.FC = () => {
  const { episodeId } = useParams<UrlParams>();

  return <EpisodeDetailsForm episodeId={Number(episodeId)} />;
};
