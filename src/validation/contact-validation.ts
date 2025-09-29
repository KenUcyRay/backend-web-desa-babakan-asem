import { z, ZodType } from "zod";

export class ContactValidation {
  static query: ZodType = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  });

  static create: ZodType = z
    .object({
      type: z.enum(["LOKASI", "TELEPON", "WHATSAPP", "EMAIL"]),
      label: z.string().min(1, "Label tidak boleh kosong"),
      value: z.string().min(1, "Value tidak boleh kosong"),
    })
    .superRefine((data, ctx) => {
      if (data.type === "EMAIL") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.value)) {
          ctx.addIssue({
            code: "custom",
            message: "Format email tidak valid",
            path: ["value"],
          });
        }
      }

      if (data.type === "TELEPON" || data.type === "WHATSAPP") {
        if (!/^08[0-9]{8,13}$/.test(data.value)) {
          ctx.addIssue({
            code: "custom",
            message: "Nomor harus diawali 08 dan panjang 10–15 digit",
            path: ["value"],
          });
        }
      }
    });

  static update: ZodType = z
    .object({
      label: z.string().optional(),
      value: z.string().optional(),
      // inject type kalau perlu validasi nomor
      type: z.enum(["LOKASI", "TELEPON", "WHATSAPP", "EMAIL"]).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.value && (data.type === "TELEPON" || data.type === "WHATSAPP")) {
        if (!/^08[0-9]{8,13}$/.test(data.value)) {
          ctx.addIssue({
            code: "custom",
            message: "Nomor harus diawali 08 dan panjang 10–15 digit",
            path: ["value"],
          });
        }
      }
      if (data.value && data.type === "EMAIL") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.value)) {
          ctx.addIssue({
            code: "custom",
            message: "Format email tidak valid",
            path: ["value"],
          });
        }
      }
    });
}
