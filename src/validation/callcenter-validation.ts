import { z, ZodType } from "zod";

export class CallCenterValidation {
  // validasi query (pagination)
  static query: ZodType = z.object({
    page: z.coerce
      .number({ message: "Invalid type" })
      .int({ message: "Invalid type" })
      .min(1, { message: "Page minimal 1" })
      .default(1),
    limit: z.coerce
      .number({ message: "Invalid type" })
      .int({ message: "Invalid type" })
      .min(1, { message: "Limit minimal 1" })
      .max(100, { message: "Limit maksimal 100" })
      .default(10),
  });

  // validasi create callcenter / whatsapp
  static create: ZodType = z
    .object({
      name: z.string().min(1, "Nama tidak boleh kosong"),
      type: z.enum(["CALL_CENTER", "WHATSAPP"], {
        errorMap: () => ({ message: "Type harus CALL_CENTER atau WHATSAPP" }),
      }),
      number: z.string(),
      is_active: z.boolean().default(true),
    })
    .superRefine((data: any, ctx) => {
      if (data.type === "CALL_CENTER") {
        if (data.number.length < 3 || data.number.length > 20) {
          ctx.addIssue({
            code: "custom",
            message: "Nomor CALL_CENTER harus 3–20 digit",
            path: ["number"],
          });
        }
      }
      if (data.type === "WHATSAPP") {
        if (data.number.length < 10 || data.number.length > 15) {
          ctx.addIssue({
            code: "custom",
            message: "Nomor WHATSAPP harus 10–15 digit",
            path: ["number"],
          });
        }
      }
    });

  // validasi update callcenter / whatsapp
  static update: ZodType = z
    .object({
      name: z.string().min(1, "Nama tidak boleh kosong").optional(),
      type: z.enum(["CALL_CENTER", "WHATSAPP"]).optional(),
      number: z.string().optional(),
      is_active: z.boolean().optional(),
    })
    .superRefine((data: any, ctx) => {
      if (data.number && data.type === "CALL_CENTER") {
        if (data.number.length < 3 || data.number.length > 20) {
          ctx.addIssue({
            code: "custom",
            message: "Nomor CALL_CENTER harus 3–20 digit",
            path: ["number"],
          });
        }
      }
      if (data.number && data.type === "WHATSAPP") {
        if (data.number.length < 10 || data.number.length > 15) {
          ctx.addIssue({
            code: "custom",
            message: "Nomor WHATSAPP harus 10–15 digit",
            path: ["number"],
          });
        }
      }
    });
}
