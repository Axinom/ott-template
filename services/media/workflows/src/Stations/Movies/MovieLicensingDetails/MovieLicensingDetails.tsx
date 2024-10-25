import React from 'react';
import { useParams } from 'react-router-dom';
import { MovieLicensingDetailsForm } from './MovieLicensingDetailsForm';

interface MovieLicensingDetailsUrlParams {
  moviesLicenseId: string;
  movieId: string;
}

export const MovieLicensingDetails: React.FC = () => {
  const { movieId, moviesLicenseId } =
    useParams<MovieLicensingDetailsUrlParams>();

  return (
    <MovieLicensingDetailsForm
      movieId={Number(movieId)}
      moviesLicenseId={Number(moviesLicenseId)}
    />
  );
};
