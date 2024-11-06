import { MoviesLicensesQuery } from '../../../generated/graphql';

export type MovieLicensesData = NonNullable<
  MoviesLicensesQuery['moviesLicenses']
>['nodes'][number];
