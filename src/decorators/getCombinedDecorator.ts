import { Field } from 'type-graphql';
import { Column, ColumnType } from 'typeorm';

import { FieldType, decoratorDefaults } from '../metadata';
import { MethodDecoratorFactory } from '../utils';

import { WarthogField } from './WarthogField';

export interface WarthogCombinedDecoratorOptions {
  warthogFieldType: FieldType;
  decoratorOptions: any;
  gqlFieldType?: any; // ReturnTypeFunc | undefined;
  dbType: ColumnType;
  columnOptions?: any;
}

export function getCombinedDecorator({
  warthogFieldType,
  decoratorOptions,
  gqlFieldType,
  dbType,
  columnOptions = {}
}: WarthogCombinedDecoratorOptions) {
  const options = { ...decoratorDefaults, ...decoratorOptions };
  const nullableOption = options.nullable === true ? { nullable: true } : {};
  const defaultOption =
    options.default === true || options.default === false ? { default: options.default } : {};

  // Warthog: start with the Warthog decorator that adds metadata for generating the GraphQL schema
  // for sorting, filtering, args, where inputs, etc...
  const decorators = [WarthogField(warthogFieldType, options)];

  // If an object is only writeable, don't add the `Field` decorators that will add it to the GraphQL type
  if (!options.writeonly) {
    // TypeGraphQL: next add the type-graphql decorator that generates the GraphQL type (or field within that type)
    decorators.push(
      Field(() => gqlFieldType, {
        ...nullableOption,
        ...defaultOption
      })
    );
  }

  // TypeORM: finally add the TypeORM decorator to describe the DB field
  decorators.push(
    Column({
      type: dbType,
      ...nullableOption,
      ...defaultOption,
      ...columnOptions
    }) as MethodDecoratorFactory
  );

  return decorators;
}
