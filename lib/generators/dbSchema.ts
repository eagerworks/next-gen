import * as fs from 'fs';

import { camelize } from '../utils';

import type { Attribute } from '../schemas/attribute';
import type { Config } from '../schemas/config';

function generateSchema(name: string, attributes: Attribute[], config: Config) {
  const template = fs.readFileSync(`${config.templates}/schema.prisma.template`);
  const interpolateValues = { className: name, name: camelize(name), schema: config.schema };
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

  fileContent = fileContent.replace(/\${([^}]*)}/g, (_r, k) => {
    if (k && k in interpolateValues) {
      return interpolateValues[k as keyof typeof interpolateValues]
    }

    return '';
  });

  fs.appendFileSync(`${config.schema}/schema.prisma`, fileContent);
}

export default generateSchema;
