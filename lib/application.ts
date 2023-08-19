import fs from 'fs';

import { type Attribute, attributeSchema } from './schemas/attribute';
import { configSchema } from './schemas/config';

import generateController from './generators/controller';
import generateSchema from './generators/dbSchema';
import generateZodSchema from './generators/zodSchema';
import generateForm from './generators/form';
import generateConfigFile from './generators/config';

import { program } from 'commander';
import chalk from 'chalk';

function commaSeparatedList(value: string, _previous: unknown) {
  return value.split(',');
}

function parseOptions(options: unknown): Attribute[] {
  if (options === undefined || options === null) {
    return [];
  }

  // if options is not an array, throw an error
  if (typeof options !== 'object') {
    throw new Error('Invalid options');
  }

  if (!Array.isArray(options)) {
    return [];
  }

  // parse options as 'name:type'
  return options.map((option) => {
    const [name, type] = option.split(':');

    return attributeSchema.parse({ name, type });
  });
}

program
  .command('generate <type> <name>')
  .description('Generate specific components for the T3 NextJS app')
  .option('-a, --attributes <attributes>', 'List of attributes written as name:type', commaSeparatedList)
  .action((type, name, options) => {
    try {
      const attributes = parseOptions(options.attributes);

      const configData = fs.readFileSync("./next-gen.json");
      const config = configSchema.parse(JSON.parse(configData.toString()));

      switch (type) {
        case 'controller':
          generateController(name, config);
          break;
        case 'schema':
          generateSchema(name, attributes, config);
          break;
        case 'zodSchemas':
          generateZodSchema(name, attributes, config);
          break;
        case 'form':
          generateForm(name, config);
          break;
        case 'scaffold':
          generateController(name, config);
          generateSchema(name, attributes, config);
          generateZodSchema(name, attributes, config);
          generateForm(name, config);
          break;
      }
    } catch (error) {
      if (error instanceof Error && 'message' in error) {
        console.error(chalk.red(error.message));
      } else {
        console.error(chalk.red("Unknown error"));
      }
    }
  });

program
  .command('init')
  .description('Generate specific components for the T3 NextJS app')
  .action(() => {
    generateConfigFile();
  });

program.parse(process.argv);
