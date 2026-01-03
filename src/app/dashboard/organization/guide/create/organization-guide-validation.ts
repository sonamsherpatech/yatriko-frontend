import { z } from "zod";

const schema = z.object({
  guideName: z
    .string()
    .min(1, "*cannot be empty")
    .regex(/^[a-zA-Z\s]*$/, "*should only contain alphabets"),

  guideEmail: z
    .string()
    .min(1, "*cannot be empty")
    .email("*invalid email format")
    .max(255, "*too long")
    .transform((v) => v.toLowerCase().trim()),

  guidePhoneNumber: z
    .string()
    .min(1, "*cannot be empty")
    .regex(/^\+977\s?(98|97)\d{8}$/, "*invalid phone number format"),

  guideAddress: z.string().optional(),

  guideSalary: z
    .number("*salary must be a number")
    .positive("*cannot be zero or negative"),

  guideImage: z.any().optional(),

  tourId: z.string().optional(),
});

export default schema;
