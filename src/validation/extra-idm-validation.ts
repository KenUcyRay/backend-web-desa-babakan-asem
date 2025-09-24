import { StatusDesa } from "@prisma/client";
import { z, ZodType } from "zod";

export class ExtraIdmValidation {
  static create: ZodType = z.object({
    type: z.enum(["sosial", "ekonomi", "lingkungan"]).optional(),
    value: z.number().min(0.0).max(1.0).optional(),
    status_desa: z.nativeEnum(StatusDesa).optional()
  }).superRefine((data, ctx) => {
    if (!data.type && !data.status_desa) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Harus ada type atau status_desa"
      });
    }
    if (data.type && data.value === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Value diperlukan jika ada type",
        path: ["value"]
      });
    }
  });
}