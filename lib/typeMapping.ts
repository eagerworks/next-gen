import { Attribute } from './schemas/attribute';

type ZodMapping = Record<'zod', string>;
type PrismaMapping = Record<'prisma', string>;
type FormMapping = Record<'form', string>;

type Mappings = Record<Attribute['type'], ZodMapping & PrismaMapping & FormMapping>;

const typesMapping: Mappings = {
  string: {
    zod: 'z.string()',
    prisma: 'String',
    form: 'text',
  },
  number: {
    zod: 'z.number()',
    prisma: 'Int',
    form: 'number',
  },
  boolean: {
    zod: 'z.boolean()',
    prisma: 'Boolean',
    form: 'checkbox',
  },
  date: {
    zod: 'z.date()',
    prisma: 'DateTime',
    form: 'date',
  },
  json: {
    zod: 'z.any()',
    prisma: 'Json',
    form: 'text',
  },
  relation: {
    zod: 'z.string()',
    prisma: 'String',
    form: 'select'
  },
  float: {
    zod: 'z.number()',
    prisma: 'Float',
    form: 'number',
  },
  decimal: {
    zod: 'z.number()',
    prisma: 'Decimal',
    form: 'number',
  },
  // TODO: This could depend on what database is being used.
  text: {
    zod: 'z.string()',
    prisma: 'String',
    form: 'textarea',
  },
}

export default typesMapping;
