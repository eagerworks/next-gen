import fs from 'fs';

import { type Attribute, attributeSchema } from './schemas/attribute';
import { configSchema } from './schemas/config';

import generateController from './generators/controller';
import generateSchema from './generators/dbSchema';
import generateZodSchema from './generators/zodSchema';
import generateForm from './generators/form';
import generateConfigFile from './generators/config';

import { program } from 'commander';

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
  .option('-a, --attributes <items>', 'List of attributes written as name:type', commaSeparatedList)
  .action((type, name, ...options) => {
    const attributes = parseOptions(options)

    const configData = fs.readFileSync("./next-gen.json");
    const config = configSchema.parse(configData.toJSON());

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
    }
  });

program
  .command('init')
  .description('Generate specific components for the T3 NextJS app')
  .action(() => {
    generateConfigFile();
  });

program.parse(process.argv);
