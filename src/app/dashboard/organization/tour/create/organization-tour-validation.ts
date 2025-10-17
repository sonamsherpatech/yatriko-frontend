import { z } from "zod";

const schema = z
  .object({
    tourTitle: z
      .string()
      .nonempty("*cannot be empty")
      .min(4, "*too short")
      .max(256, "*too long")
      .regex(/^[a-zA-Z0-9\s]*$/, "*cannot contain special characters"),
    tourDescription: z
      .string()
      .nonempty("*cannot be empty")
      .min(5, "*too short"),
    tourNumberOfPeople: z
      .string()
      .nonempty("*cannot be empty")
      .regex(/^\d+$/, "*must be valid number")
      .refine((val) => Number(val) > 0, "*canno be negative"),
    tourPrice: z
      .string()
      .nonempty("*cannot be empty")
      .regex(/^\d+(\.\d{1,2})?$/, "*must be a valid price")
      .refine((val) => Number(val) > 0, "*cannot be negative"),
    tourDuration: z
      .string()
      .nonempty("*cannot be empty")
      .refine((val) => Number(val) > 0, "*cannot be negative"),
    tourStartDate: z
      .string()
      .nonempty("*cannot be empty")
      .refine((val) => {
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }, "*date cannot be in the past"),
    tourEndDate: z.string().nonempty("*cannot be empty"),
  })
  .refine((data) => new Date(data.tourEndDate) >= new Date(data.tourStartDate), {
    message: "*end date must be after start date",
    path: ["tourEndDate"],
  });

export default schema;
  