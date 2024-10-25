import React from 'react';
import { useParams } from 'react-router-dom';
import { TvShowLicensingDetailsForm } from './TvShowLicensingDetailsForm';

export const TvShowLicensingDetails: React.FC = () => {
  const params = useParams<{
    tvshowsLicenseId: string;
    tvshowId: string;
  }>();

  return (
    <TvShowLicensingDetailsForm
      tvshowId={Number(params.tvshowId)}
      tvshowsLicenseId={Number(params.tvshowsLicenseId)}
    />
  );
};
