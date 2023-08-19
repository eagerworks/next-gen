import * as fs from 'fs';

import { camelize } from '../utils';

import type { Config } from '../schemas/config';
import path from 'path';

function generateController(name: string, config: Config) {
  const template = fs.readFileSync(path.resolve(config.templates || path.resolve(__dirname, '../templates'), 'router.ts.template'));
  const interpolateValues = { className: name, name: camelize(name), schemas: config.zodSchemas };
  const fileContent = template.toString().replace(/\${([^}]*)}/g, (_r, k) => {
    if (k && k in interpolateValues) {
      return interpolateValues[k as keyof typeof interpolateValues]
    }

    return '';
  });

  fs.mkdirSync(path.resolve(config.routers), { recursive: true });
  fs.writeFileSync(path.resolve(config.routers, `${name}.ts`), fileContent);
}

export default generateController;
