import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { MovieData } from '../MovieExplorerBase/MovieExplorer.types';
import { MovieImageManagementForm } from './MovieImageManagementForm';

export const MovieImageManagementQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<MovieData>>(QuickEditContext);

  return <MovieImageManagementForm movieId={selectedItem.id} />;
};
