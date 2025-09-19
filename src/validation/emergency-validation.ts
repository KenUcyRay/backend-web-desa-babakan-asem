import { z, ZodType } from "zod";

export class EmergencyValidation {
  static create: ZodType = z
    .object({
      phone_number: z
        .string()
        .min(10, "Nomor minimal 10 digit")
        .max(15, "Nomor maksimal 15 digit")
        .optional()
        .nullable(), // ✅ opsional
      message: z.string().min(5).max(500),
      latitude: z.coerce
        .string()
        .regex(/^-?\d+(\.\d+)?$/, "Invalid latitude"),
      longitude: z.coerce
        .string()
        .regex(/^-?\d+(\.\d+)?$/, "Invalid longitude"),
    })
    .strict();

  static query: ZodType = z.object({
    page: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(1, { message: "zodErrors.min_value" })
      .default(1),
    limit: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(1, { message: "zodErrors.min_value" })
      .default(10),
    is_handled: z.preprocess((val) => {
      if (typeof val === "string" && val.toLowerCase() === "true") return true;
      if (typeof val === "string" && val.toLowerCase() === "false")
        return false;
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    }, z.boolean({ message: "zodErrors.invalid_type" }).optional()),
  });
}
