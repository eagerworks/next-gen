import * as fs from "fs";

import { camelize } from "../utils";

import type { Config } from "../schemas/config";

function generateForm(modelName: string, config: Config) {
  const template = fs.readFileSync(`${config.templates}/router.ts.template`);
  const className = modelName;
  const name = camelize(modelName);
  const interpolateValues = { className, name, config: config.zodSchemas };
  const fileContent = template.toString().replace(/\${([^}]*)}/g, (_r, k) => {
    if (k && k in interpolateValues) {
      return interpolateValues[k as keyof typeof interpolateValues]
    }

    return '';
  });

  fs.writeFileSync(`${config.pages}/${name}/${className}Form.tsx`, fileContent);
}

export default generateForm;
