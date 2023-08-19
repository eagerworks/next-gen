import * as fs from "fs";
import { camelize } from "../utils";

import type { Config } from "../schemas/config";

import path from "path";
import chalk from "chalk";

import interpolate from "../utils/interpolate";

function generateForm(modelName: string, config: Config) {
  const template = fs.readFileSync(
    path.resolve(
      config.templates || path.resolve(__dirname, "../templates"),
      "form.ts.template",
    ),
  );
  const className = modelName;
  const name = camelize(modelName);
  const interpolateValues = {
    name,
    schemas: "~/" + config.zodSchemas.replace("./", "").replace("src/", ""),
  };

  const fileContent = interpolate(template.toString(), interpolateValues);

  fs.mkdirSync(path.resolve(config.pages, name), { recursive: true });

  fs.writeFileSync(
    path.resolve(config.pages, name, `${className}Form.tsx`),
    fileContent,
  );

  console.log(chalk.green("Generated form"));
}

export default generateForm;
