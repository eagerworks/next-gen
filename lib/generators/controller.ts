import * as fs from 'fs';

import { camelize } from '../utils';

import type { Config } from '../schemas/config';
import path from 'path';
import chalk from 'chalk';
import interpolate from '../utils/interpolate';

function generateController(modelName: string, config: Config) {
  const template = fs.readFileSync(path.resolve(config.templates || path.resolve(__dirname, '../templates'), 'router.ts.template'));
  const name = camelize(modelName);
  const interpolateValues = { name, schemas: '~/' + config.zodSchemas.replace('./', '').replace('src/', '') };
  const fileContent = interpolate(template.toString(), interpolateValues);

  fs.mkdirSync(path.resolve(config.routers), { recursive: true });
  fs.writeFileSync(path.resolve(config.routers, `${pluralize(name)}.ts`), fileContent);
  console.log(chalk.green("Generated Router"));
}

export default generateController;
