import { TvshowsLicensesQuery } from '../../../generated/graphql';

export type TvshowLicensesData = NonNullable<
  TvshowsLicensesQuery['tvshowsLicenses']
>['nodes'][number];
