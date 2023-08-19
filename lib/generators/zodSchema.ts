import * as fs from 'fs';

import { camelize } from '../utils';

import type { Attribute } from '../schemas/attribute';
import type { Config } from '../schemas/config';

import path from 'path';

function generateZodSchema(modelName: string, attributes: Attribute[], config: Config) {
  const template = fs.readFileSync(path.resolve(config.templates || path.resolve(__dirname, '../templates'), 'zod.ts.template'));
  const className = modelName;
  const name = camelize(modelName);
  const interpolateValues = { className, name };
  let fileContent = template.toString();

  fileContent = fileContent.replace(/\${attributes}/g, () => {
    return attributes.map((attribute) => {
      switch (attribute.type) {
        case 'string':
          return `${attribute.name}: z.string()`;
        case 'number':
          return `${attribute.name}: z.number()`;
        case 'boolean':
          return `${attribute.name}: z.boolean()`;
        case 'date':
          return `${attribute.name}: z.date()`;
        default:
          console.warn("Type not supporter yet")
          return '';
      }
    }).join(',\n  ');
  });

  fileContent = fileContent.replace(/\${([^}]*)}/g, (_r, k) => {
    if (k && k in interpolateValues) {
      return interpolateValues[k as keyof typeof interpolateValues]
    }

    return '';
  });

  fs.mkdirSync(path.resolve(config.zodSchemas), { recursive: true });

  fs.writeFileSync(path.resolve(config.zodSchemas, `${name}.ts`), fileContent);
}

export default generateZodSchema;
