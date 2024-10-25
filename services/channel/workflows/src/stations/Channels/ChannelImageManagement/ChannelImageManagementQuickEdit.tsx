import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { ChannelsData } from '../ChannelsExplorer/Channels.types';
import { ChannelImageManagementForm } from './ChannelImageManagementForm';

export const ChannelImageManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<ChannelsData>>(QuickEditContext);

  return <ChannelImageManagementForm channelId={selectedItem.id} />;
};
