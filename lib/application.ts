import program from './commandParser';
import fs from 'fs';

import * as z from 'zod';

const configData = fs.readFileSync("./next-gen.json");

const configSchema = z.object({
  models: z.string(),
  routers: z.string(),
  zodSchemas: z.string(),
  schema: z.string(),
  pages: z.string(),
  templates: z.string().default("../templates/"),
});

const config = configSchema.parse(configData.toJSON());

function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

const attributeSchema = z.object({
  type: z.enum(['string', 'number', 'boolean', 'date', 'json', 'relation']),
  name: z.string(),
});

type Attributes = z.infer<typeof attributeSchema>[];

function parseOptions(options: unknown): Attributes {
  if (options === undefined || options === null) {
    return [];
  }

  // if options is not an array, throw an error
  if (typeof options !== 'object') {
    throw new Error('Invalid options');
  }

  if (!Array.isArray(options)) {
    return [];
  }

  // parse options as 'name:type'
  return options.map((option) => {
    const [name, type] = option.split(':');

    return attributeSchema.parse({ name, type });
  });
}

program
  .action((type, name, ...options) => {
    const attributes = parseOptions(options)

    switch (type) {
      case 'controller':
        generateController(name);
        break;
      case 'schema':
        generateSchema(name, attributes);
        break;
      case 'zodSchemas':
        generateZodSchema(name, attributes);
      case 'form':
        generateForm(name);
        break;
    }
  });

program.parse(process.argv);

function generateController(name: string) {
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

function generateSchema(name: string, attributes: Attributes) {
  const template = fs.readFileSync(`${config.templates}/schema.prisma.template`);
  const interpolateValues = { className: name, name: camelize(name), schema: config.schema };
  let fileContent = template.toString();

  // Find ${attributes} and change it to the attributes for prisma
  fileContent = fileContent.replace(/\${attributes}/g, () => {
    return attributes.map((attribute) => {
      switch (attribute.type) {
        case 'string':
          return `${attribute.name} String`;
        case 'number':
          return `${attribute.name} Int`;
        case 'boolean':
          return `${attribute.name} Boolean`;
        case 'date':
          return `${attribute.name} DateTime`;
        case 'json':
          return `${attribute.name} Json`;
        default:
          console.warn("Type not supporter yet")
          return '';
      }
    }).join('\n  ');
  });

  fileContent = fileContent.replace(/\${([^}]*)}/g, (_r, k) => {
    if (k && k in interpolateValues) {
      return interpolateValues[k as keyof typeof interpolateValues]
    }

    return '';
  });

  fs.appendFileSync(`${config.schema}/schema.prisma`, fileContent);
}

function generateZodSchema(modelName: string, attributes: Attributes) {
  const template = fs.readFileSync(`${config.templates}/zodSchema.ts.template`);
  const className = modelName;
  const name = camelize(modelName);
  const interpolateValues = { className, name };
  let fileContent = template.toString();

  fileContent = fileContent.replace(/\${attributes}/g, () => {
    return attributes.map((attribute) => {
      switch (attribute.type) {
        case 'string':
          return `${attribute.name}: z.string()`;
        case 'number':
          return `${attribute.name}: z.number()`;
        case 'boolean':
          return `${attribute.name}: z.boolean()`;
        case 'date':
          return `${attribute.name}: z.date()`;
        default:
          console.warn("Type not supporter yet")
          return '';
      }
    }).join(',\n  ');
  });

  fileContent = fileContent.replace(/\${([^}]*)}/g, (_r, k) => {
    if (k && k in interpolateValues) {
      return interpolateValues[k as keyof typeof interpolateValues]
    }

    return '';
  });

  fs.writeFileSync(`${config.zodSchemas}/${name}.ts`, fileContent);
}

function generateForm(modelName: string) {
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
