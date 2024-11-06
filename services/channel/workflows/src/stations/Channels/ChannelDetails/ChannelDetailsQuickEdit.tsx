import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { ChannelsData } from '../ChannelsExplorer/Channels.types';
import { ChannelDetailsForm } from './ChannelDetailsForm';

export const ChannelDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<ChannelsData>>(QuickEditContext);

  return <ChannelDetailsForm channelId={selectedItem.id} />;
};
