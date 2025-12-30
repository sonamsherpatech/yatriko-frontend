import { z } from "zod";

const schema = z
  .object({
    tourTitle: z
      .string()
      .nonempty("Tour title must not be empty")
      .min(3, "Tour title must be at least 3 characters")
      .max(255, "Tour title must not exceed 255 characters"),

    tourDescription: z
      .string()
      .nonempty("Tour description must not be empty")
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description must not exceed 2000 characters"),

    totalCapacity: z
      .string()
      .nonempty("Tour capacity must not be empty")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Total capacity must be a positive number",
      })
      .refine((val) => Number(val) <= 100, {
        message: "Total capacity cannot exceed 100",
      }),

    basePrice: z
      .string()
      .nonempty("Tour base price must not be empty")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Base price must be a positive number",
      })
      .refine((val) => Number(val) >= 1, {
        message: "Base price must be at least $1",
      }),

    tourDuration: z.string().min(1, "Duration is required"),

    tourStartDate: z
      .string()
      .nonempty("Tour start date must not be empty")
      .refine(
        (val) => {
          const date = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: "Start date must be today or in the future",
        }
      ),

    tourEndDate: z
      .string()
      .nonempty("Tour end date must not be empty")
      .refine((val) => val !== "", {
        message: "End date is required",
      }),

    categoryIds: z
      .array(z.string())
      .min(1, "Please select at least one category"),

    tourPhoto: z.union([z.instanceof(File), z.string()]).optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.tourStartDate);
      const end = new Date(data.tourEndDate);
      return end >= start;
    },
    {
      message: "End date must be equal to or after start date",
      path: ["tourEndDate"],
    }
  );

export default schema;
