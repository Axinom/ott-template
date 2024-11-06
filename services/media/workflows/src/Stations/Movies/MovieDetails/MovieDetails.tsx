import React from 'react';
import { useParams } from 'react-router-dom';
import { MovieDetailsForm } from './MovieDetailsForm';

interface UrlParams {
  movieId: string;
}

export const MovieDetails: React.FC = () => {
  const { movieId } = useParams<UrlParams>();

  return <MovieDetailsForm movieId={Number(movieId)} />;
};
