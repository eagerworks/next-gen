import * as z from "zod";

const configSchema = z.object({
  models: z.string(),
  routers: z.string(),
  zodSchemas: z.string(),
  schema: z.string(),
  pages: z.string(),
  organisms: z.string(),
  templates: z.string().optional(),
  rootRouter: z.string(),
});

type Config = z.infer<typeof configSchema>;

export { configSchema, Config };
