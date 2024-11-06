import React from 'react';
import { useParams } from 'react-router-dom';
import { TvShowVideoManagementForm } from './TvShowVideoManagementForm';

interface UrlParams {
  tvshowId: string;
}

export const TvShowVideoManagement: React.FC = () => {
  const { tvshowId } = useParams<UrlParams>();

  return <TvShowVideoManagementForm tvshowId={Number(tvshowId)} />;
};
