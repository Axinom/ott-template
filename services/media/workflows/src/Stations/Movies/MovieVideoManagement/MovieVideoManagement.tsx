import React from 'react';
import { useParams } from 'react-router-dom';
import { MovieVideoManagementForm } from './MovieVideoManagementForm';

interface UrlParams {
  movieId: string;
}

export const MovieVideoManagement: React.FC = () => {
  const { movieId } = useParams<UrlParams>();

  return <MovieVideoManagementForm movieId={Number(movieId)} />;
};
