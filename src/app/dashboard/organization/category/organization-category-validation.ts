import { z } from "zod";

const categorySchema = z.object({
  categoryName: z
    .string()
    .nonempty("*cannot be empty")
    .max(255, "*too long")
    .regex(/^[a-zA-Z\s]*$/, "*cannot contain numbers and special characters")
    .trim()
    .toLowerCase(),
  categoryDescription: z
    .string()
    .nonempty("*cannot be empty")
    .min(5, "*too short"),
});

export default categorySchema;
