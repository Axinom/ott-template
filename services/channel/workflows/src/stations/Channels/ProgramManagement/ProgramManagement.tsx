import React from 'react';
import { useParams } from 'react-router-dom';
import { ProgramManagementForm } from './ProgramManagementForm';

interface UrlParams {
  channelId: string;
  playlistId: string;
}

export const ProgramManagement: React.FC = () => {
  const { channelId, playlistId } = useParams<UrlParams>();

  return (
    <ProgramManagementForm channelId={channelId} playlistId={playlistId} />
  );
};
