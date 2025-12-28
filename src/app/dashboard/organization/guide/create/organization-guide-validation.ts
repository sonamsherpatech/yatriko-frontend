import { z } from "zod";

const schema = z.object({
  guideName: z
    .string()
    .nonempty("*cannot be empty")
    .regex(/^[a-zA-Z\s]*$/, "*should only contain alphabet"),
  guideEmail: z
    .email("*invalid email format")
    .nonempty("*cannot be empty")
    .max(255, "*too long")
    .toLowerCase()
    .trim(),
  guidePhoneNumber: z
    .string()
    .nonempty("*cannot be empty")
    .max(15, "*too long")
    .regex(/\+977\s?(98|97)\d{8}$/, "*invalid phone number format"),
  guideSalary: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "*must be a valid price")
    .refine((sal) => Number(sal) > 0, "*cannot be negative"),
});

export default schema;
