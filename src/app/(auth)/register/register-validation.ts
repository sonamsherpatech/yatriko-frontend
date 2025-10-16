import { z } from "zod";

export const schema = z
  .object({
    username: z
      .string()
      .nonempty("*cannot be empty")
      .min(3, "*too short")
      .max(20, "*too long")
      .regex(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        "*Must start with a letter and only contain letters, numbers, or underscores"
      ),
    email: z
      .string()
      .nonempty("*cannot be empty")
      .email("*invalid email format")
      .max(254, "*too long")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .nonempty("*cannot be empty")
      .min(8, "*minimum 8 characters long")
      .max(64, "*password too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+])[A-Za-z\d!@#$%^&*()\-_=+]{8,64}$/,
        "*must include uppercase, lowercase, number and special characters"
      ),
    confirmPassword: z.string().nonempty("*cannot be empty"),
    
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "*password doesn't match",
    path: ["confirmPassword"],
  });
