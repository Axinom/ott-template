import React from 'react';
import { useParams } from 'react-router-dom';
import { TvShowLicensingDetailsForm } from './TvShowLicensingDetailsForm';

interface UrlParams {
  tvshowId: string;
  tvshowsLicenseId: string;
}

export const TvShowLicensingDetails: React.FC = () => {
  const { tvshowId, tvshowsLicenseId } = useParams<UrlParams>();

  return (
    <TvShowLicensingDetailsForm
      tvshowId={Number(tvshowId)}
      tvshowsLicenseId={Number(tvshowsLicenseId)}
    />
  );
};
