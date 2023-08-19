import * as fs from "fs";
import { camelize } from "../utils";

import type { Config } from "../schemas/config";

import path from "path";
import chalk from "chalk";

import interpolate from "../utils/interpolate";

function generateEdit(modelName: string, config: Config) {
  const template = fs.readFileSync(
    path.resolve(
      config.templates || path.resolve(__dirname, "../templates"),
      "Edit.ts.template",
    ),
  );

  const name = camelize(modelName);
  const interpolateValues = {
    name
  };

  const fileContent = interpolate(template.toString(), interpolateValues);

  const dirPath = path.resolve(config.pages, name, '[id]');

  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(
    path.resolve(dirPath, "Edit.tsx"),
    fileContent,
  );

  console.log(`${chalk.green("Generated Edit")} - ${chalk.yellow(dirPath)}/${chalk.yellow("Edit.tsx")}`);
}

function generateIndex(modelName: string, config: Config) {
  const template = fs.readFileSync(
    path.resolve(
      config.templates || path.resolve(__dirname, "../templates"),
      "index.ts.template",
    ),
  );

  const name = camelize(modelName);
  const interpolateValues = { name };

  const fileContent = interpolate(template.toString(), interpolateValues);

  const dirPath = path.resolve(config.pages, name);

  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(
    path.resolve(dirPath, "index.tsx"),
    fileContent,
  );

  console.log(`${chalk.green("Generated Index")} - ${chalk.yellow(dirPath)}/${chalk.yellow("index.tsx")}`);
}

function generateNew(modelName: string, config: Config) {
  const template = fs.readFileSync(
    path.resolve(
      config.templates || path.resolve(__dirname, "../templates"),
      "New.ts.template",
    ),
  );

  const name = camelize(modelName);
  const interpolateValues = { name };

  const fileContent = interpolate(template.toString(), interpolateValues);

  const dirPath = path.resolve(config.pages, name);

  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(
    path.resolve(dirPath, "New.tsx"),
    fileContent,
  );

  console.log(`${chalk.green("Generated New")} - ${chalk.yellow(dirPath)}/${chalk.yellow("New.tsx")}`);
}

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
  const dirPath = path.resolve(config.organisms);

  fs.mkdirSync(dirPath, { recursive: true });

  fs.writeFileSync(
    path.resolve(dirPath, `${className}Form.tsx`),
    fileContent,
  );

  console.log(`${chalk.green("Generated Form")} - ${chalk.yellow(dirPath)}/${chalk.yellow(`${className}Form.tsx`)}`);

  generateNew(modelName, config);
  generateEdit(modelName, config);
  generateIndex(modelName, config);
}

export default generateForm;
