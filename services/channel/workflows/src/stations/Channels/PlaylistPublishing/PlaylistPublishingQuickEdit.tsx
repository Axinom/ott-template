import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { PlaylistsData } from '../PlaylistsExplorer/Playlists.types';
import { PlaylistPublishingForm } from './PlaylistPublishingForm';

export const PlaylistPublishingQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<PlaylistsData>>(QuickEditContext);

  return <PlaylistPublishingForm playlistId={selectedItem.id} />;
};
