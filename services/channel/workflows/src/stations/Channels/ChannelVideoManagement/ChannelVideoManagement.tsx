import React from 'react';
import { useParams } from 'react-router-dom';
import { ChannelVideoManagementForm } from './ChannelVideoManagementForm';

interface UrlParams {
  channelId: string;
}

export const ChannelVideoManagement: React.FC = () => {
  const { channelId } = useParams<UrlParams>();

  return <ChannelVideoManagementForm channelId={channelId} />;
};
