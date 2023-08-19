import * as fs from "fs";

import { camelize } from "../utils";

import type { Config } from "../schemas/config";
import path from "path";
import chalk from "chalk";
import interpolate from "../utils/interpolate";

function generateController(modelName: string, config: Config) {
  const template = fs.readFileSync(
    path.resolve(
      config.templates || path.resolve(__dirname, "../templates"),
      "router.ts.template",
    ),
  );
  const name = camelize(modelName);
  const interpolateValues = {
    name,
    schemas: "~/" + config.zodSchemas.replace("./", "").replace("src/", ""),
  };
  const fileContent = interpolate(template.toString(), interpolateValues);

  const dirPath = path.resolve(config.routers);

  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(
    path.resolve(dirPath, `${pluralize(name)}.ts`),
    fileContent,
  );

  console.log(`${chalk.green("Generated Controller")} - ${chalk.yellow(dirPath)}/${chalk.yellow(`${pluralize(name)}.ts`)}`);

  // Find root router and add new router to it
  const routesPath = path.resolve(config.rootRouter);
  const rootRouter = fs.readFileSync(routesPath);

  let rootRouterContent = rootRouter.toString();
  const routerStatement = `,\n  ${pluralize(name)}: ${pluralize(name)}Router,$1`;
  rootRouterContent = rootRouterContent.replace(
    /,([^,]*)$/,
    routerStatement,
  );

  const importStatement = `$1import { ${pluralize(name)}Router } from "./routers/${pluralize(name)}";\n`;
  rootRouterContent = rootRouterContent.replace(
    /(import .*;\n)(?!import)/,
    importStatement,
  );

  fs.writeFileSync(routesPath, rootRouterContent);

  console.log(`${chalk.green("Updated Root Router")} - ${chalk.yellow(routesPath)}`);
}

export default generateController;
