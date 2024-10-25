import React from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistDetailsForm } from './PlaylistDetailsForm';

interface UrlParams {
  channelId: string;
  playlistId: string;
}

export const PlaylistDetails: React.FC = () => {
  const { channelId, playlistId } = useParams<UrlParams>();

  return <PlaylistDetailsForm channelId={channelId} playlistId={playlistId} />;
};
