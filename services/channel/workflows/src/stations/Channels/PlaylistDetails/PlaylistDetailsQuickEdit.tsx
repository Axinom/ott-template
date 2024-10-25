import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistsData } from '../PlaylistsExplorer/Playlists.types';
import { PlaylistDetailsForm } from './PlaylistDetailsForm';

interface UrlParams {
  channelId: string;
}

export const PlaylistDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<PlaylistsData>>(QuickEditContext);

  const { channelId } = useParams<UrlParams>();

  return (
    <PlaylistDetailsForm playlistId={selectedItem.id} channelId={channelId} />
  );
};
