import * as z from "zod";

const attributeSchema = z.object({
  type: z.enum(["string", "number", "boolean", "date", "json", "relation"]),
  name: z.string(),
});

type Attribute = z.infer<typeof attributeSchema>;

export { attributeSchema, Attribute };
