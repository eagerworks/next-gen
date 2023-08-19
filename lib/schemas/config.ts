import * as z from "zod";

const configSchema = z.object({
  models: z.string(),
  routers: z.string(),
  zodSchemas: z.string(),
  schema: z.string(),
  pages: z.string(),
  templates: z.string().optional(),
});

type Config = z.infer<typeof configSchema>;

export { configSchema, Config };
