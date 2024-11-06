import {
  ActionData,
  Column,
  createConnectionRenderer,
  DateRenderer,
  ExplorerDataProvider,
  IconName,
  NavigationExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { client } from '../../../apolloClient';
import {
  EpisodesLicensesCountriesConnection,
  EpisodesLicensesDocument,
  EpisodesLicensesOrderBy,
  EpisodesLicensesQuery,
  EpisodesLicensesQueryVariables,
  useDeleteEpisodesLicenseMutation,
} from '../../../generated/graphql';
import { getCountryName } from '../../../Util/CountryNames/CountryNames';
import { EpisodeLicensingDetailsQuickEdit } from '../EpisodeLicensingDetails/EpisodeLicensingDetailsQuickEdit';
import { EpisodeLicensesData } from './EpisodeLicensing.types';

export const EpisodeLicensing: React.FC = () => {
  const episodeId = Number(
    useParams<{
      episodeId: string;
    }>().episodeId,
  );

  const history = useHistory();

  const [deleteEpisodesLicenseMutation] = useDeleteEpisodesLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  // Columns
  const explorerColumns: Column<EpisodeLicensesData>[] = [
    {
      propertyName: 'licenseStart',
      label: 'From',
      render: DateRenderer,
    },
    {
      propertyName: 'licenseEnd',
      label: 'Until',
      render: DateRenderer,
    },
    {
      label: 'Licensing Countries',
      propertyName: 'episodesLicensesCountries',
      size: '4fr',
      render: createConnectionRenderer<EpisodesLicensesCountriesConnection>(
        (node) => getCountryName(node.code),
      ),
    },
  ];

  // Data provider
  const dataProvider: ExplorerDataProvider<EpisodeLicensesData> = {
    loadData: async ({ pagingInformation, sorting }) => {
      const result = await client.query<
        EpisodesLicensesQuery,
        EpisodesLicensesQueryVariables
      >({
        query: EpisodesLicensesDocument,
        variables: {
          filter: { episodeId: { equalTo: episodeId } },
          orderBy: sortToPostGraphileOrderBy(sorting, EpisodesLicensesOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.episodesLicenses?.nodes ?? [],
        totalCount: result.data.episodesLicenses?.totalCount as number,
        filteredCount: result.data.episodesLicenses?.totalCount as number,
        hasMoreData:
          result.data.episodesLicenses?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.episodesLicenses?.pageInfo.endCursor,
      };
    },
  };

  const generateInlineMenuActions: (
    data: EpisodeLicensesData,
  ) => ActionData[] = ({ id }) => {
    return [
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteEpisodesLicenseMutation({ variables: { input: { id } } });
          history.push(`/episodes/${episodeId}/licenses`);
        },
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
      {
        label: 'Open Details',
        path: `/episodes/${episodeId}/licenses/${id}`,
      },
    ];
  };

  return (
    <NavigationExplorer<EpisodeLicensesData>
      title="Episode Licensing"
      stationKey="EpisodesLicenseExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(item) =>
        `/episodes/${episodeId}/licenses/${item.id}`
      }
      onCreateAction={`/episodes/${episodeId}/licenses/create`}
      inlineMenuActions={generateInlineMenuActions}
      quickEditRegistrations={[
        {
          component: <EpisodeLicensingDetailsQuickEdit />,
          label: 'Licensing Details',
        },
      ]}
    />
  );
};
