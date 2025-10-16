import { z } from "zod";

export const schema = z.object({
  organizationName: z
    .string()
    .nonempty("*cannot be empty")
    .min(2, "*too short")
    .max(60, "*too long")
    .regex(/^[A-Za-z\s]*$/, "*should only contain letters"),
  organizationEmail: z
    .string()
    .nonempty("*cannot be empty")
    .email("*invalid email format")
    .max(255, "*too long")
    .toLowerCase()
    .trim(),
  organizationPhoneNumber: z
    .string()
    .nonempty("*cannot be empty")
    .max(15, "*too long")
    .regex(
      /^\+977\s?(98|97)\d{8}$/,
      "*invalid number format(correct: +977 9800000001)"
    )
    .trim(),
  organizationAddress: z
    .string()
    .nonempty("*cannot be empty")
    .max(255, "*too long")
    .trim(),
  organizationPanNo: z.string().length(9, "*should be of 9 digit"),
  organizationVatNo: z.string().length(9, "*should be of 9 digit"),
});
