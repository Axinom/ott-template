import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { ChannelsData } from '../ChannelsExplorer/Channels.types';
import { ChannelPublishingForm } from './ChannelPublishingForm';

export const ChannelPublishingQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<ChannelsData>>(QuickEditContext);

  return <ChannelPublishingForm channelId={selectedItem.id} />;
};
