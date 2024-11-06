import { EpisodesLicensesQuery } from '../../../generated/graphql';

export type EpisodeLicensesData = NonNullable<
  EpisodesLicensesQuery['episodesLicenses']
>['nodes'][number];
