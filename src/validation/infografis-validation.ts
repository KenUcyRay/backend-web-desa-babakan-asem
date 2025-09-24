import { StatusDesa } from "@prisma/client";
import z, { ZodType } from "zod";

export class InfografisValidation {
  static createIdm: ZodType = z.object({
    year: z
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(2000, { message: "zodErrors.min_value" }),
    skor: z.number({ message: "zodErrors.required" }),
  });

  static updateIdm: ZodType = z.object({
    year: z
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(2000, { message: "zodErrors.min_value" })
      .optional(),
    skor: z.number({ message: "zodErrors.invalid_type" }).optional(),
  });

  static createBansos: ZodType = z.object({
    name: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.required" }),
    amount: z
      .number({ message: "zodErrors.required" })
      .min(0, { message: "zodErrors.min_value" }),
  });

  static updateBansos: ZodType = z.object({
    name: z
      .string({ message: "zodErrors.invalid_type" })
      .min(1, { message: "zodErrors.required" })
      .optional(),
    amount: z
      .number({ message: "zodErrors.invalid_type" })
      .min(0, { message: "zodErrors.min_value" })
      .optional(),
  });

  static createSdgs: ZodType = z.object({
    name: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.required" })
      .refine((name) => {
        const validNames = [
          "Tanpa Kemiskinan",
          "Tanpa Kelaparan", 
          "Kesehatan & Kesejahteraan",
          "Pendidikan Berkualitas",
          "Kesetaraan Gender",
          "Air Bersih & Sanitasi",
          "Energi Bersih & Terjangkau",
          "Pekerjaan Layak & Ekonomi",
          "Infrastruktur & Inovasi",
          "Mengurangi Ketimpangan",
          "Kota & Komunitas Berkelanjutan",
          "Konsumsi Bertanggung Jawab",
          "Aksi Iklim",
          "Ekosistem Lautan",
          "Ekosistem Daratan",
          "Perdamaian & Keadilan",
          "Kemitraan untuk Tujuan"
        ];
        return validNames.includes(name);
      }, { message: "zodErrors.invalid_value" }),
    progress: z
      .number({ message: "zodErrors.required" })
      .min(0, { message: "zodErrors.min_value" })
      .max(100, { message: "zodErrors.max_value" }),
  });

  static updateSdgs: ZodType = z.object({
    progress: z
      .number({ message: "zodErrors.required" })
      .min(0, { message: "zodErrors.min_value" })
      .max(100, { message: "zodErrors.max_value" }),
  });

  static updateExtraIdm: ZodType = z.object({
    status_desa: z
      .nativeEnum(StatusDesa, { message: "zodErrors.invalid_value" })
      .optional(),
    sosial: z.number({ message: "zodErrors.invalid_type" }).optional(),
    ekonomi: z.number({ message: "zodErrors.invalid_type" }).optional(),
    lingkungan: z.number({ message: "zodErrors.invalid_type" }).optional(),
    created_at: z.date({ message: "zodErrors.invalid_type" }).optional(),
  });
}
