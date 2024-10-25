import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonLicensingDetailsForm } from './SeasonLicensingDetailsForm';

interface UrlParams {
  seasonsLicenseId: string;
  seasonId: string;
}

export const SeasonLicensingDetails: React.FC = () => {
  const { seasonId, seasonsLicenseId } = useParams<UrlParams>();

  return (
    <SeasonLicensingDetailsForm
      seasonId={Number(seasonId)}
      seasonsLicenseId={Number(seasonsLicenseId)}
    />
  );
};
