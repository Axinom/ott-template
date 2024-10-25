import React from 'react';
import { useParams } from 'react-router-dom';
import { SeasonLicensingDetailsForm } from './SeasonLicensingDetailsForm';

export const SeasonLicensingDetails: React.FC = () => {
  const params = useParams<{
    seasonsLicenseId: string;
    seasonId: string;
  }>();

  const seasonsLicenseId = Number(params.seasonsLicenseId);
  const seasonId = Number(params.seasonId);

  return (
    <SeasonLicensingDetailsForm
      seasonId={seasonId}
      seasonsLicenseId={seasonsLicenseId}
    />
  );
};
