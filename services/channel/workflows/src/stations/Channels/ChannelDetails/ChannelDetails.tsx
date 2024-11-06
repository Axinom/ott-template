import React from 'react';
import { useParams } from 'react-router-dom';
import { ChannelDetailsForm } from './ChannelDetailsForm';

interface UrlParams {
  channelId: string;
}

export const ChannelDetails: React.FC = () => {
  const { channelId } = useParams<UrlParams>();

  return <ChannelDetailsForm channelId={channelId} />;
};
