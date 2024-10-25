import React from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeLicensingDetailsForm } from './EpisodeLicensingDetailsForm';

interface EpisodeLicensingDetailsUrlParams {
  episodesLicenseId: string;
  episodeId: string;
}

export const EpisodeLicensingDetails: React.FC = () => {
  const { episodeId, episodesLicenseId } =
    useParams<EpisodeLicensingDetailsUrlParams>();

  return (
    <EpisodeLicensingDetailsForm
      episodeId={Number(episodeId)}
      episodesLicenseId={Number(episodesLicenseId)}
    />
  );
};
