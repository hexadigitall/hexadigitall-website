import { type SchemaTypeDefinition } from 'sanity';
import author from './schemas/author';
import resourceMatrix from './schemas/resourceMatrix';
import publication from './schemas/publication';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, resourceMatrix, publication],
};
