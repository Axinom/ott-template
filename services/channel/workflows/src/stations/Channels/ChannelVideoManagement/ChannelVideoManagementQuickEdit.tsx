import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { ChannelsData } from '../ChannelsExplorer/Channels.types';
import { ChannelVideoManagementForm } from './ChannelVideoManagementForm';

export const ChannelVideoManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<ChannelsData>>(QuickEditContext);

  return <ChannelVideoManagementForm channelId={selectedItem.id} />;
};
