import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { TvShowData } from '../TvShowExplorerBase/TvShowExplorer.types';
import { TvShowVideoManagementForm } from './TvShowVideoManagementForm';

export const TvShowVideoManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<TvShowData>>(QuickEditContext);

  return <TvShowVideoManagementForm tvshowId={selectedItem?.id} />;
};
