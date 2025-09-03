import { MapType } from "@prisma/client";
import { z, ZodType } from "zod";

export class MapValidation {
  static createMap: ZodType = z
    .object({
      type: z.nativeEnum(MapType, { message: "zodErrors.invalid_value" }),
      name: z.string().min(1, { message: "zodErrors.required" }),
      description: z.string().min(1, { message: "zodErrors.required" }),
      year: z.coerce.number().min(1900, { message: "zodErrors.min_value" }),
      coordinates: z
        .any()
        .transform((val, ctx) => {
          if (typeof val === "string") {
            try {
              const parsed = JSON.parse(val);
              return parsed;
            } catch (error) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "zodErrors.invalid_coordinates_format",
              });
              return z.NEVER;
            }
          }
          return val;
        })
        .pipe(z.union([z.array(z.number()), z.array(z.array(z.number()))])),
      color: z
        .string()
        .min(1, { message: "zodErrors.required" })
        .max(9, { message: "zodErrors.max_length" })
        .optional(),
      area: z.coerce
        .number()
        .min(0, { message: "zodErrors.min_value" })
        .optional(),
      radius: z.coerce
        .number()
        .min(0, { message: "zodErrors.min_value" })
        .optional(),
    })
    .strict();

  static update: ZodType = z
    .object({
      type: z
        .nativeEnum(MapType, { message: "zodErrors.invalid_value" })
        .optional(),
      name: z.string().min(1, { message: "zodErrors.required" }).optional(),
      description: z
        .string()
        .min(1, { message: "zodErrors.required" })
        .optional(),
      year: z.coerce
        .number()
        .min(1900, { message: "zodErrors.min_value" })
        .optional(),
      coordinates: z
        .any()
        .transform((val, ctx) => {
          if (typeof val === "string") {
            try {
              const parsed = JSON.parse(val);
              return parsed;
            } catch (error) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "zodErrors.invalid_coordinates_format",
              });
              return z.NEVER;
            }
          }
          return val;
        })
        .pipe(z.union([z.array(z.number()), z.array(z.array(z.number()))])),
      color: z
        .string()
        .min(1, { message: "zodErrors.required" })
        .max(9, { message: "zodErrors.max_length" })
        .optional(),
      area: z.coerce
        .number()
        .min(0, { message: "zodErrors.min_value" })
        .optional(),
      radius: z.coerce
        .number()
        .min(0, { message: "zodErrors.min_value" })
        .optional(),
    })
    .strict();
}
