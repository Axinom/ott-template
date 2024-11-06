import { SeasonsLicensesQuery } from '../../../generated/graphql';

export type SeasonLicensesData = NonNullable<
  SeasonsLicensesQuery['seasonsLicenses']
>['nodes'][number];
