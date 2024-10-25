import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MovieLicensesData } from '../MovieLicensing/MovieLicensing.types';
import { MovieLicensingDetailsForm } from './MovieLicensingDetailsForm';

interface MovieLicensingDetailsQuickEditUrlParams {
  movieId: string;
}

export const MovieLicensingDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<MovieLicensesData>>(QuickEditContext);

  const { movieId } = useParams<MovieLicensingDetailsQuickEditUrlParams>();

  return (
    <MovieLicensingDetailsForm
      movieId={Number(movieId)}
      moviesLicenseId={selectedItem.id}
    />
  );
};
