import { z } from "zod";

const schema = z.object({
  tourName: z
    .string()
    .nonempty("*cannot be empty")
    .min(4, "*too short")
    .max(256, "*too long")
    .regex(/^[a-zA-Z0-9\s]*$/, "*cannot contain special characters"),
});

export default schema;
