import React from 'react';
import { useParams } from 'react-router-dom';
import { MovieLicensingDetailsForm } from './MovieLicensingDetailsForm';

interface UrlParams {
  moviesLicenseId: string;
  movieId: string;
}

export const MovieLicensingDetails: React.FC = () => {
  const { movieId, moviesLicenseId } = useParams<UrlParams>();

  return (
    <MovieLicensingDetailsForm
      movieId={Number(movieId)}
      moviesLicenseId={Number(moviesLicenseId)}
    />
  );
};
