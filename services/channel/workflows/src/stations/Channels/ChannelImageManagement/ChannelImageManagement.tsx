import React from 'react';
import { useParams } from 'react-router-dom';
import { ChannelImageManagementForm } from './ChannelImageManagementForm';

interface UrlParams {
  channelId: string;
}

export const ChannelImageManagement: React.FC = () => {
  const { channelId } = useParams<UrlParams>();

  return <ChannelImageManagementForm channelId={channelId} />;
};
