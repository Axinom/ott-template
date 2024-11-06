import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistsData } from '../PlaylistsExplorer/Playlists.types';
import { ProgramManagementForm } from './ProgramManagementForm';

interface UrlParams {
  channelId: string;
}

export const ProgramManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<PlaylistsData>>(QuickEditContext);

  const { channelId } = useParams<UrlParams>();

  return (
    <ProgramManagementForm playlistId={selectedItem.id} channelId={channelId} />
  );
};
