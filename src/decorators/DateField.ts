import { Field, GraphQLISODateTime } from 'type-graphql';
import { Column } from 'typeorm';

import { decoratorDefaults, DecoratorDefaults } from '../metadata';
import { ColumnType, defaultColumnType } from '../torm';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

import { WarthogField } from './WarthogField';

interface DateFieldOptions extends DecoratorDefaults {
  dataType?: ColumnType; // int16, jsonb, etc...
  default?: Date;
}

export function DateField(args: DateFieldOptions = {}): any {
  const options = { ...decoratorDefaults, ...args };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption = options.default ? { default: options.default } : {};
  const databaseConnection: string = process.env.WARTHOG_DB_CONNECTION || '';
  const type = defaultColumnType(databaseConnection, 'date');

  // These are the 2 required decorators to get type-graphql and typeorm working
  const factories = [
    WarthogField('date', options),
    Field(() => GraphQLISODateTime, {
      ...nullableOption
    }),
    Column({
      type: args.dataType || type,
      ...nullableOption,
      ...defaultOption
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
