import React from 'react';
import { useParams } from 'react-router-dom';
import { TvShowDetailsForm } from './TvShowDetailsForm';

interface UrlParams {
  tvshowId: string;
}

export const TvShowDetails: React.FC = () => {
  const { tvshowId } = useParams<UrlParams>();

  return <TvShowDetailsForm tvshowId={Number(tvshowId)} />;
};
