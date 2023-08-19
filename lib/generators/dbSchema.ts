import * as fs from 'fs';

import type { Attribute } from '../schemas/attribute';
import type { Config } from '../schemas/config';
import path from 'path';
import chalk from 'chalk';
import interpolate from '../utils/interpolate';

function generateSchema(name: string, attributes: Attribute[], config: Config) {
  const template = fs.readFileSync(path.resolve(config.templates || path.resolve(__dirname, '../templates'), 'schema.prisma.template'));
  const interpolateValues = { name };
  let fileContent = template.toString();

  // Find ${attributes} and change it to the attributes for prisma
  fileContent = fileContent.replace(/\${attributes}/g, () => {
    return attributes.map((attribute) => {
      switch (attribute.type) {
        case 'string':
          return `${attribute.name} String`;
        case 'number':
          return `${attribute.name} Int`;
        case 'boolean':
          return `${attribute.name} Boolean`;
        case 'date':
          return `${attribute.name} DateTime`;
        case 'json':
          return `${attribute.name} Json`;
        default:
          console.warn("Type not supporter yet")
          return '';
      }
    }).join('\n  ');
  });

  fileContent = interpolate(fileContent, interpolateValues)

  fs.appendFileSync(path.resolve(config.schema, 'schema.prisma'), fileContent);
  console.log(chalk.green("Updated dbSchema"));
}

export default generateSchema;
