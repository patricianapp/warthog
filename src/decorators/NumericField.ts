import { Field, Float } from 'type-graphql';
import { Column } from 'typeorm';
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';

import { decoratorDefaults, DecoratorDefaults } from '../metadata';
import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { NumericColumnType } from '../torm';

import { WarthogField } from './WarthogField';

interface NumericFieldOptions extends ColumnCommonOptions, ColumnNumericOptions, DecoratorDefaults {
  dataType?: NumericColumnType;
}

export function NumericField(args: NumericFieldOptions = decoratorDefaults): any {
  const { dataType, filter, sort, ...dbOptions } = args;
  const options = { ...decoratorDefaults, ...args };

  const nullableOption = options.nullable === true ? { nullable: true } : {};

  const factories = [
    WarthogField('numeric', options),
    Field(() => Float, {
      ...nullableOption
    }),
    Column({
      ...dbOptions,
      ...nullableOption,
      type: args.dataType || 'numeric'
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
