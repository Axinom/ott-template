import React from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeLicensingDetailsForm } from './EpisodeLicensingDetailsForm';

interface UrlParams {
  episodesLicenseId: string;
  episodeId: string;
}

export const EpisodeLicensingDetails: React.FC = () => {
  const { episodeId, episodesLicenseId } = useParams<UrlParams>();

  return (
    <EpisodeLicensingDetailsForm
      episodeId={Number(episodeId)}
      episodesLicenseId={Number(episodesLicenseId)}
    />
  );
};
