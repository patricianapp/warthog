import { GraphQLBoolean } from 'graphql';

import { DecoratorDefaults } from '../metadata';
import { composeMethodDecorators } from '../utils';

import { getCombinedDecorator } from './getCombinedDecorator';

interface BooleanFieldOptions extends DecoratorDefaults {
  default?: boolean;
}

export function BooleanField(decoratorOptions: BooleanFieldOptions = {}): any {
  const factories = getCombinedDecorator({
    warthogFieldType: 'boolean',
    decoratorOptions: decoratorOptions,
    gqlFieldType: GraphQLBoolean,
    dbType: 'boolean'
  });

  return composeMethodDecorators(...factories);
}
