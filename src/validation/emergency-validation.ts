import { z, ZodType } from "zod";

export class EmergencyValidation {
  static create: ZodType = z
    .object({
      phone_number: z
        .string()
        .min(10, "Nomor minimal 10 digit")
        .max(20, "Nomor maksimal 20 digit") // Increased from 15 to 20
        .nullish() // Use nullish() instead of optional().nullable()
        .or(z.literal("")), // Allow empty string
      message: z
        .string()
        .min(1, "Pesan tidak boleh kosong") // Reduced from 5 to 1
        .max(1000, "Pesan terlalu panjang"), // Increased from 500 to 1000
      latitude: z
        .string()
        .min(1, "Latitude diperlukan")
        .regex(/^-?\d+(\.\d+)?$/, "Format latitude tidak valid"),
      longitude: z
        .string()
        .min(1, "Longitude diperlukan")
        .regex(/^-?\d+(\.\d+)?$/, "Format longitude tidak valid"),
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
      .max(100, { message: "zodErrors.max_value" })
      .default(10),
    is_handled: z.preprocess((val) => {
      if (typeof val === "string" && val.toLowerCase() === "true") return true;
      if (typeof val === "string" && val.toLowerCase() === "false") return false;
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    }, z.boolean({ message: "zodErrors.invalid_type" }).optional()),
  });

  static update: ZodType = z
    .object({
      is_handled: z.boolean().optional(),
    })
    .strict();
}