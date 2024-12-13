import { Plugin } from 'graphile-build';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

export const ScalarTypesPlugin: Plugin = (builder) => {
  builder.hook('build', (_, { addType }) => {
    addType(GraphQLUpload);

    return _;
  });
};
