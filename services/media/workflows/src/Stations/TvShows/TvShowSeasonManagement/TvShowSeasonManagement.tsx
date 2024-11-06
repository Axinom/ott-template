import React from 'react';
import { useParams } from 'react-router-dom';
import { TvShowSeasonManagementForm } from './TvShowSeasonManagementForm';

interface UrlParams {
  tvshowId: string;
}

export const TvShowSeasonManagement: React.FC = () => {
  const { tvshowId } = useParams<UrlParams>();

  return <TvShowSeasonManagementForm tvshowId={Number(tvshowId)} />;
};
