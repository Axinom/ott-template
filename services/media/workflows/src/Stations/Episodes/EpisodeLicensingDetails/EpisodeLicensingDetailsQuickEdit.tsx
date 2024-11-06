import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { EpisodeLicensesData } from '../EpisodeLicensing/EpisodeLicensing.types';
import { EpisodeLicensingDetailsForm } from './EpisodeLicensingDetailsForm';

interface UrlParams {
  episodeId: string;
}

export const EpisodeLicensingDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<EpisodeLicensesData>>(QuickEditContext);

  const { episodeId } = useParams<UrlParams>();

  return (
    <EpisodeLicensingDetailsForm
      episodeId={Number(episodeId)}
      episodesLicenseId={Number(selectedItem.id)}
    />
  );
};
