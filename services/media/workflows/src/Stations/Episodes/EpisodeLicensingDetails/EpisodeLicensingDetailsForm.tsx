import {
  createUpdateGQLFragmentGenerator,
  DateTimeTextField,
  Details,
  DetailsProps,
  FormActionData,
  generateArrayMutations,
  getFormDiff,
  TagsField,
} from '@axinom/mosaic-ui';
import { Field } from 'formik';
import gql from 'graphql-tag';
import { ObjectSchemaDefinition } from 'ObjectSchemaDefinition';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { client } from '../../../apolloClient';
import {
  IsoAlphaTwoCountryCodes,
  Mutation,
  MutationCreateEpisodesLicensesCountryArgs,
  MutationDeleteEpisodesLicensesCountryArgs,
  MutationUpdateEpisodesLicenseArgs,
  useDeleteEpisodesLicenseMutation,
  useEpisodesLicenseQuery,
} from '../../../generated/graphql';
import { CountryNames } from '../../../Util/CountryNames/CountryNames';
import {
  getLicenseEndSchema,
  getLicenseStartSchema,
} from '../../../Util/LicenseDateSchema/LicenseDateSchema';

type FormData = MutationUpdateEpisodesLicenseArgs['input']['patch'] & {
  countries?: IsoAlphaTwoCountryCodes[];
};

interface EpisodeLicensingDetailsFormProps {
  episodesLicenseId: number;
  episodeId: number;
}

const licenseSchema = Yup.object().shape<ObjectSchemaDefinition<FormData>>({
  episodeId: Yup.number().required(),
  licenseStart: getLicenseStartSchema().label('From'),
  licenseEnd: getLicenseEndSchema().label('To'),
});

export const EpisodeLicensingDetailsForm: React.FC<
  EpisodeLicensingDetailsFormProps
> = ({ episodeId, episodesLicenseId }) => {
  const { loading, data, error } = useEpisodesLicenseQuery({
    client,
    variables: { id: episodesLicenseId },
    fetchPolicy: 'no-cache',
  });

  const { countries } = useMemo(
    () => ({
      countries: data?.episodesLicense?.episodesLicensesCountries.nodes.map(
        (country) => country.code,
      ),
    }),
    [data],
  );

  const { actions } = useActions(episodesLicenseId, episodeId);

  const onSubmit = useCallback(
    async (
      formData: FormData,
      initialData: DetailsProps<FormData>['initialData'],
    ): Promise<void> => {
      const generateUpdateGQLFragment =
        createUpdateGQLFragmentGenerator<Mutation>();

      const countryAssignmentMutations = generateArrayMutations({
        current: formData.countries,
        original: initialData.data?.countries,
        generateCreateMutation: (code) =>
          generateUpdateGQLFragment<MutationCreateEpisodesLicensesCountryArgs>(
            'createEpisodesLicensesCountry',
            {
              input: {
                episodesLicensesCountry: {
                  code: { type: 'enum', value: code },
                  episodesLicenseId,
                },
              },
            },
          ),
        generateDeleteMutation: (code) =>
          generateUpdateGQLFragment<MutationDeleteEpisodesLicensesCountryArgs>(
            'deleteEpisodesLicensesCountry',
            {
              input: { code: { type: 'enum', value: code }, episodesLicenseId },
            },
          ),
      });

      const patch = createUpdateDto(formData, initialData.data);

      const licenseUpdateMutations =
        Object.keys(patch).length > 0
          ? generateUpdateGQLFragment<MutationUpdateEpisodesLicenseArgs>(
              'updateEpisodesLicense',
              {
                input: { id: episodesLicenseId, patch },
              },
            )
          : '';

      const GqlMutationDocument = gql`mutation UpdateEpisodesLicense {
        ${licenseUpdateMutations}
        ${countryAssignmentMutations}
      }`;

      await client.mutate({ mutation: GqlMutationDocument });
    },
    [episodesLicenseId],
  );

  return (
    <Details<FormData>
      defaultTitle="Episode Licensing Details"
      subtitle="Properties"
      alwaysShowActionsPanel={true}
      actions={actions}
      validationSchema={licenseSchema}
      initialData={{
        data: {
          ...data?.episodesLicense,
          countries,
        },
        loading,
        entityNotFound: data?.episodesLicense === null,
        error: error?.message,
      }}
      saveData={onSubmit}
    >
      <Form />
    </Details>
  );
};

const Form: React.FC = () => {
  return (
    <>
      <Field name="licenseStart" label="From" as={DateTimeTextField} />
      <Field name="licenseEnd" label="To" as={DateTimeTextField} />
      <Field
        name="countries"
        label="Licensing Countries"
        tagsOptions={CountryNames}
        as={TagsField}
        displayKey="display"
        valueKey="value"
      />
    </>
  );
};

function useActions(
  id: number,
  episodeId: number,
): {
  readonly actions: FormActionData<FormData>[];
} {
  const history = useHistory();

  const [deleteEpisodesLicenseMutation] = useDeleteEpisodesLicenseMutation({
    client,
    fetchPolicy: 'no-cache',
  });

  const deleteLicense = async (): Promise<void> => {
    await deleteEpisodesLicenseMutation({ variables: { input: { id } } });
    history.push(`/episodes/${episodeId}/licenses`);
  };

  const actions: FormActionData[] = [
    {
      label: 'Delete',
      confirmationMode: 'Simple',
      onActionSelected: deleteLicense,
    },
  ];

  return { actions } as const;
}

function createUpdateDto(
  currentValues: FormData,
  initialValues?: FormData | null,
): Partial<FormData> {
  const { countries, ...rest } = getFormDiff(currentValues, initialValues);

  return rest;
}
