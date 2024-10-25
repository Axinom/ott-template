import React from 'react';
import { useParams } from 'react-router-dom';
import { MovieImageManagementForm } from './MovieImageManagementForm';

interface UrlParams {
  movieId: string;
}

export const MovieImageManagement: React.FC = () => {
  const { movieId } = useParams<UrlParams>();

  return <MovieImageManagementForm movieId={Number(movieId)} />;
};
