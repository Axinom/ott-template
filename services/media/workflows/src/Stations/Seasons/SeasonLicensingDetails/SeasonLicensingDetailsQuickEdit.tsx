import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SeasonLicensesData } from '../SeasonLicensing/SeasonLicensing.types';
import { SeasonLicensingDetailsForm } from './SeasonLicensingDetailsForm';

interface UrlParams {
  seasonId: string;
}

export const SeasonLicensingDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<SeasonLicensesData>>(QuickEditContext);

  const { seasonId } = useParams<UrlParams>();

  return (
    <SeasonLicensingDetailsForm
      seasonId={Number(seasonId)}
      seasonsLicenseId={selectedItem.id}
    />
  );
};
