import React from 'react';
import { useParams } from 'react-router-dom';
import { ChannelPublishingForm } from './ChannelPublishingForm';

interface UrlParams {
  channelId: string;
}

export const ChannelPublishing: React.FC = () => {
  const { channelId } = useParams<UrlParams>();

  return <ChannelPublishingForm channelId={channelId} />;
};
