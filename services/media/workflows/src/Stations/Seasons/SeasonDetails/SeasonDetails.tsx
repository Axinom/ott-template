import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonDetailsForm } from './SeasonDetailsForm';

interface UrlParams {
  seasonId: string;
}

export const SeasonDetails: React.FC = () => {
  const { seasonId } = useParams<UrlParams>();

  return <SeasonDetailsForm seasonId={Number(seasonId)} />;
};
