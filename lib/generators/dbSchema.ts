import * as fs from "fs";

import type { Attribute } from "../schemas/attribute";
import type { Config } from "../schemas/config";
import path from "path";
import chalk from "chalk";
import interpolate from "../utils/interpolate";

import typesMapping from "../typeMapping";

function attributeBuilder(attribute: Attribute) {
  return `${attribute.name} ${typesMapping[attribute.type].prisma}`;
}

function generateSchema(name: string, attributes: Attribute[], config: Config) {
  const template = fs.readFileSync(
    path.resolve(
      config.templates || path.resolve(__dirname, "../templates"),
      "schema.prisma.template",
    ),
  );
  const interpolateValues = { name };
  let fileContent = template.toString();

  fileContent = fileContent.replace(/\${attributes}/g, () =>
    attributes.map((attribute) => attributeBuilder(attribute)).join("\n  ")
  );

  fileContent = interpolate(fileContent, interpolateValues);

  fs.appendFileSync(path.resolve(config.schema, "schema.prisma"), fileContent);
  console.log(chalk.green("Updated dbSchema"));
}

export default generateSchema;
