import * as fs from "fs";
import { camelize } from "../utils";

import type { Config } from "../schemas/config";

import path from "path";

function generateForm(modelName: string, config: Config) {
  const template = fs.readFileSync(path.resolve(config.templates || path.resolve(__dirname, '../templates'), 'form.ts.template'));
  const className = modelName;
  const name = camelize(modelName);
  const interpolateValues = { className, name, config: config.zodSchemas };
  const fileContent = template.toString().replace(/\${([^}]*)}/g, (_r, k) => {
    if (k && k in interpolateValues) {
      return interpolateValues[k as keyof typeof interpolateValues]
    }

    return '';
  });

  fs.mkdirSync(path.resolve(config.pages, name), { recursive: true });

  fs.writeFileSync(path.resolve(config.pages, name, `${className}Form.tsx`), fileContent);
}

export default generateForm;
