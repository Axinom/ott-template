import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { TvshowLicensesData } from '../TvShowLicensing/TvShowLicensing.types';
import { TvShowLicensingDetailsForm } from './TvShowLicensingDetailsForm';

interface UrlParams {
  tvshowId: string;
}

export const TvShowLicensingDetailsQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<TvshowLicensesData>>(QuickEditContext);

  const { tvshowId } = useParams<UrlParams>();

  return (
    <TvShowLicensingDetailsForm
      tvshowId={Number(tvshowId)}
      tvshowsLicenseId={selectedItem.id}
    />
  );
};
