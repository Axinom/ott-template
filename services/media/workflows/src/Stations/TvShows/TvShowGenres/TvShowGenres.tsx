import { getLocalizationEntryPoint } from '@axinom/mosaic-managed-workflow-integration';
import {
  ActionData,
  createInputRenderer,
  createUpdateGQLFragmentGenerator,
  Details,
  DetailsProps,
  DynamicDataList,
  formatDateTime,
  generateArrayMutationsWithUpdates,
  InfoPanel,
  ObjectSchemaDefinition,
  Paragraph,
  Section,
} from '@axinom/mosaic-ui';
import { useFormikContext } from 'formik';
import gql from 'graphql-tag';
import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import { Constants } from '../../../constants';
import {
  Mutation,
  MutationCreateTvshowGenreArgs,
  MutationDeleteTvshowGenreArgs,
  MutationUpdateTvshowGenreArgs,
  SnapshotState,
  TvShowGenresDocument,
  TvShowGenresQuery,
  useTvShowGenresQuery,
} from '../../../generated/graphql';
import { useTvShowGenresActions } from './TvShowGenres.actions';
import classes from './TvShowGenres.module.scss';
import { FormDataGenre, TvShowGenresFormData } from './TvShowGenres.types';

export const TvShowGenres: React.FC = () => {
  const { loading, data, error } = useTvShowGenresQuery({
    client,
    fetchPolicy: 'no-cache',
  });

  const onSubmit = useCallback(
    async (
      formData: TvShowGenresFormData,
      initialData: DetailsProps<TvShowGenresFormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const mutations = generateArrayMutationsWithUpdates({
        current: formData.genres,
        original: initialData.data?.genres,
        generateCreateMutation: (item: FormDataGenre): string =>
          generateUpdateGQLFragment<MutationCreateTvshowGenreArgs>(
            'createTvshowGenre',
            {
              input: {
                tvshowGenre: { sortOrder: item.sortOrder, title: item.title },
              },
            },
          ),
        generateDeleteMutation: (item: FormDataGenre): string =>
          generateUpdateGQLFragment<MutationDeleteTvshowGenreArgs>(
            'deleteTvshowGenre',
            { input: { id: item.id } },
          ),
        generateUpdateMutation: (item: FormDataGenre): string =>
          generateUpdateGQLFragment<MutationUpdateTvshowGenreArgs>(
            'updateTvshowGenre',
            {
              input: {
                id: item.id,
                patch: { title: item.title, sortOrder: item.sortOrder },
              },
            },
          ),
        key: 'id',
      });

      const GqlMutationDocument = gql`mutation UpdateTvShowGenre {
        ${mutations}
      }`;

      await client.mutate({
        mutation: GqlMutationDocument,
        refetchQueries: [TvShowGenresDocument],
        awaitRefetchQueries: true,
      });
    },
    [],
  );

  const { actions } = useTvShowGenresActions();

  return (
    <Details<TvShowGenresFormData>
      defaultTitle="TV Show Genres"
      subtitle="Properties"
      initialData={{
        data: { genres: data?.tvshowGenres?.nodes },
        loading,
        error: error?.message,
      }}
      saveData={onSubmit}
      infoPanel={<Panel data={data} />}
      actions={actions}
    >
      <Form />
    </Details>
  );
};

const Form: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<TvShowGenresFormData>();
  const localizationPath = getLocalizationEntryPoint('tv_show_genre');

  const rowValidationSchema = useMemo(
    () =>
      Yup.object<ObjectSchemaDefinition>({
        title: Yup.string()
          .label('Title')
          .trim()
          .required()
          .test((value, context) => {
            if (
              value &&
              (values.genres || []).find((item) => item.title === value)
            ) {
              return context.createError({
                message: ({ label }) => `${label} must be unique`,
              });
            }
            return true;
          }),
      }),
    [values],
  );

  const generateInlineMenuActions: ((data) => ActionData[]) | undefined =
    localizationPath
      ? ({ id: genreId }) => {
          return [
            {
              label: 'Localizations',
              path: localizationPath.replace(':genreId', genreId),
            },
            {
              label: 'Delete',
              onActionSelected: () => {
                const removeIndex: number = (values.genres || []).findIndex(
                  (item) => item.id === genreId,
                );
                if (values.genres?.length && removeIndex >= 0) {
                  setFieldValue('genres', [
                    ...values.genres.slice(0, removeIndex),
                    ...values.genres.slice(removeIndex + 1),
                  ]);
                }
              },
            },
          ];
        }
      : undefined;
  return (
    <DynamicDataList<FormDataGenre>
      columns={[
        {
          propertyName: 'title',
          label: 'Title',
          dataEntryRender: createInputRenderer({ placeholder: 'Enter Title' }),
        },
      ]}
      allowNewData={true}
      positionPropertyName="sortOrder"
      value={values.genres ?? []}
      onChange={(v) => {
        setFieldValue('genres', v);
      }}
      stickyHeader={false}
      inlineMenuActions={generateInlineMenuActions}
      rowValidationSchema={rowValidationSchema}
    />
  );
};

const Panel: React.FC<{ data?: TvShowGenresQuery }> = ({ data }) => {
  const sortedGenres = useMemo(() => {
    if (!data?.tvshowGenres?.nodes) {
      return [];
    }
    return data.tvshowGenres.nodes.slice().sort((a, b) => {
      const dateA = new Date(a.updatedDate);
      const dateB = new Date(b.updatedDate);
      return dateB.getTime() - dateA.getTime();
    });
  }, [data?.tvshowGenres?.nodes]);

  return useMemo(() => {
    return (
      <InfoPanel>
        <Section title="Additional Information">
          {sortedGenres.length > 0 && (
            <Paragraph title="Last Modified">
              {formatDateTime(sortedGenres[0].updatedDate)} by{' '}
              {sortedGenres[0].updatedUser}
            </Paragraph>
          )}
          <Paragraph title="Statistic">
            <div className={classes.datalist}>
              <div>Items Total</div>
              <div className={classes.rightAlignment}>
                {data?.tvshowGenres?.totalCount}
              </div>
            </div>
          </Paragraph>
          <Paragraph title="Publishing Status">
            {data?.snapshots?.nodes[0]?.snapshotState ===
            SnapshotState.Published
              ? Constants.PUBLISHED
              : Constants.NOT_PUBLISHED}
          </Paragraph>
          {data?.snapshots?.nodes[0] && (
            <Paragraph title="Published">
              {formatDateTime(data?.snapshots?.nodes[0]?.publishedDate)} by{' '}
              {data?.snapshots?.nodes[0]?.updatedUser}
            </Paragraph>
          )}
        </Section>
      </InfoPanel>
    );
  }, [sortedGenres, data?.tvshowGenres?.totalCount, data?.snapshots?.nodes]);
};
