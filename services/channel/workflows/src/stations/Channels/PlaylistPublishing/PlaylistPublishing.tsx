import React from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistPublishingForm } from './PlaylistPublishingForm';

interface UrlParams {
  playlistId: string;
}

export const PlaylistPublishing: React.FC = () => {
  const { playlistId } = useParams<UrlParams>();

  return <PlaylistPublishingForm playlistId={playlistId} />;
};
