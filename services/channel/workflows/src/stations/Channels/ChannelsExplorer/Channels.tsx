import { createThumbnailAndStateRenderer } from '@axinom/mosaic-managed-workflow-integration';
import {
  ActionData,
  Column,
  DateRenderer,
  ExplorerDataProvider,
  IconName,
  NavigationExplorer,
  sortToPostGraphileOrderBy,
} from '@axinom/mosaic-ui';
import React from 'react';
import { useHistory } from 'react-router';
import { client } from '../../../apolloClient';
import {
  ChannelsDocument,
  ChannelsOrderBy,
  ChannelsQuery,
  ChannelsQueryVariables,
  useDeleteChannelMutation,
  useUnpublishChannelMutation,
} from '../../../generated/graphql';
import { publicationStateMap } from '../../../util/Publishing/publicationStateMap';
import { ChannelDetailsQuickEdit } from '../ChannelDetails/ChannelDetailsQuickEdit';
import { ChannelImageManagementQuickEdit } from '../ChannelImageManagement/ChannelImageManagementQuickEdit';
import { ChannelPublishingQuickEdit } from '../ChannelPublishing/ChannelPublishingQuickEdit';
import { ChannelVideoManagementQuickEdit } from '../ChannelVideoManagement/ChannelVideoManagementQuickEdit';
import { routes } from '../routes';
import { filterOptions, transformFilters } from './Channels.filters';
import classes from './Channels.module.scss';
import { ChannelsData } from './Channels.types';

export const Channels: React.FC = () => {
  const [deleteChannelMutation] = useDeleteChannelMutation({
    client,
  });
  const [unpublishChannelMutation] = useUnpublishChannelMutation({
    client,
  });

  const dataProvider: ExplorerDataProvider<ChannelsData> = {
    loadData: async ({ pagingInformation, sorting, filters }) => {
      const result = await client.query<ChannelsQuery, ChannelsQueryVariables>({
        query: ChannelsDocument,
        variables: {
          filter: transformFilters(filters),
          orderBy: sortToPostGraphileOrderBy(sorting, ChannelsOrderBy),
          after: pagingInformation,
        },
        fetchPolicy: 'network-only',
      });

      return {
        data: result.data.filtered?.nodes ?? [],
        totalCount: result.data.nonFiltered?.totalCount as number,
        filteredCount: result.data.filtered?.totalCount as number,
        hasMoreData: result.data.filtered?.pageInfo.hasNextPage || false,
        pagingInformation: result.data.filtered?.pageInfo.endCursor,
      };
    },
  };

  const explorerColumns: Column<ChannelsData>[] = [
    {
      propertyName: 'publicationState',
      label: '',
      render: createThumbnailAndStateRenderer(
        'channelImages',
        publicationStateMap,
      ),
      size: '80px',
    },
    {
      propertyName: 'title',
      size: '1.5fr',
      label: 'Title',
    },
    {
      propertyName: 'createdDate',
      size: '1fr',
      label: 'Created At',
      render: DateRenderer,
    },
    {
      propertyName: 'updatedDate',
      size: '1fr',
      label: 'Last Modified At',
      render: DateRenderer,
    },
    {
      propertyName: 'publishedDate',
      size: '1fr',
      label: 'Last Published At',
      render: DateRenderer,
    },
  ];

  const history = useHistory();

  const generateInlineMenuActions: (data: ChannelsData) => ActionData[] = ({
    id: channelId,
    publishedDate,
  }) => {
    return [
      {
        label: 'Open Details',
        path: routes.generate(routes.channelDetails, {
          channelId,
        }),
      },
      {
        label: 'Publishing',
        path: routes.generate(routes.channelPublishing, {
          channelId,
        }),
      },
      {
        label: 'Unpublish',
        confirmationMode: 'Advanced',
        onActionSelected: async () => {
          await unpublishChannelMutation({
            variables: { input: { id: channelId } },
          });
          history.push(routes.channels);
        },
        isDisabled: !publishedDate,
        confirmationConfig: {
          body: (
            <>
              <p>Are you sure you want to unpublish the channel?</p>
            </>
          ),
        },
      },
      {
        label: 'Delete',
        onActionSelected: async () => {
          await deleteChannelMutation({
            variables: { input: { id: channelId } },
          });
          history.push(routes.channels);
        },
        isDisabled: !!publishedDate,
        icon: IconName.Delete,
        confirmationMode: 'Simple',
      },
    ];
  };

  return (
    <NavigationExplorer<ChannelsData>
      title="Channels"
      stationKey="ChannelExplorer"
      columns={explorerColumns}
      dataProvider={dataProvider}
      calculateNavigateUrl={(rowData) =>
        routes.generate(routes.channelDetails, {
          channelId: rowData.id,
        })
      }
      filterOptions={filterOptions}
      defaultSortOrder={{ column: 'updatedDate', direction: 'desc' }}
      onCreateAction={routes.channelCreate}
      className={classes.explorer}
      inlineMenuActions={generateInlineMenuActions}
      quickEditRegistrations={[
        {
          component: <ChannelDetailsQuickEdit />,
          label: 'Channel Details',
        },
        {
          component: <ChannelImageManagementQuickEdit />,
          label: 'Manage Logo',
          generateDetailsLink: (item) =>
            routes.generate(routes.channelLogo, { channelId: item.id }),
        },
        {
          component: <ChannelVideoManagementQuickEdit />,
          label: 'Manage Videos',
          generateDetailsLink: (item) =>
            routes.generate(routes.channelVideos, { channelId: item.id }),
        },
        {
          component: <ChannelPublishingQuickEdit />,
          label: 'Publishing Validation',
          generateDetailsLink: (item) =>
            routes.generate(routes.channelPublishing, { channelId: item.id }),
        },
      ]}
    />
  );
};
