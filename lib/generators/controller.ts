import * as fs from 'fs';

import { camelize } from '../utils';

import type { Config } from '../schemas/config';

function generateController(name: string, config: Config) {
  const template = fs.readFileSync(`${config.templates}/router.ts.template`);
  const interpolateValues = { className: name, name: camelize(name), schemas: config.zodSchemas };
  const fileContent = template.toString().replace(/\${([^}]*)}/g, (_r, k) => {
    if (k && k in interpolateValues) {
      return interpolateValues[k as keyof typeof interpolateValues]
    }

    return '';
  });

  fs.writeFileSync(`${config.routers}/${name}.ts`, fileContent);
}

export default generateController;
