import { PengantarType } from "@prisma/client";
import { z, ZodType } from "zod";

export class AdministrationValidation {
  static pengantar: ZodType = z.object({
    name: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.required" }),
    nik: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.required" }),
    keterangan: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.required" }),
    type: z.nativeEnum(PengantarType, { message: "zodErrors.invalid_value" }),
    phone: z
      .string({ message: "zodErrors.required"})
      .min(8, { message: "zodErrors.invalid_value"}),
  });

  static query: ZodType = z.object({
    page: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(1, { message: "zodErrors.min_value" })
      .default(1),
    size: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(1, { message: "zodErrors.min_value" })
      .default(10),
    isPending: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    }, z.boolean({ message: "zodErrors.invalid_type" }).optional()),
  });
}
