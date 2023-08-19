import * as fs from "fs";

import { camelize } from "../utils";

import type { Attribute } from "../schemas/attribute";
import type { Config } from "../schemas/config";

import path from "path";
import chalk from "chalk";

import interpolate from "../utils/interpolate";

import typesMapping from "../typeMapping";

function attributeBuilder(attribute: Attribute) {
  return `${attribute.name}: ${typesMapping[attribute.type].zod}`;
}

function generateZodSchema(
  modelName: string,
  attributes: Attribute[],
  config: Config,
) {
  const template = fs.readFileSync(
    path.resolve(
      config.templates || path.resolve(__dirname, "../templates"),
      "zod.ts.template",
    ),
  );
  const name = camelize(modelName);
  const interpolateValues = { name };
  let fileContent = template.toString();

  fileContent = fileContent.replace(/\${attributes}/g, () =>
    attributes.map((attribute) => attributeBuilder(attribute)).join(",\n  ")
  );

  fileContent = interpolate(fileContent, interpolateValues);

  fs.mkdirSync(path.resolve(config.zodSchemas), { recursive: true });

  fs.writeFileSync(
    path.resolve(config.zodSchemas, `${name}Schema.ts`),
    fileContent,
  );

  console.log(chalk.green("Generated zodSchema"));
}

export default generateZodSchema;
