import { ResidentType } from "@prisma/client";
import { z, ZodType } from "zod";

export class ResidentValidation {
  static query: ZodType = z.object({
    type: z.nativeEnum(ResidentType, { message: "zodErrors.invalid_value" }),
  });

  static create: ZodType = z.object({
    type: z.nativeEnum(ResidentType, { message: "zodErrors.invalid_value" }),
    key: z
      .string({ message: "zodErrors.required" })
      .min(1, { message: "zodErrors.required" }),
    value: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(0, { message: "zodErrors.min_value" }),
  }).superRefine((data, ctx) => {
    const validKeys: Record<string, string[]> = {
      GENDER: ["laki-laki", "perempuan"],
      PERNIKAHAN: ["menikah", "belum menikah", "cerai"],
      AGAMA: ["islam", "kristen", "hindu", "buddha", "katolik"],
      PENDIDIKAN: ["sd", "smp", "sma", "diploma", "d3", "s1", "s2", "s3"],
      PERKERJAAN: ["petani", "nelayan", "guru", "pedagang", "pegawai", "wiraswasta", "pns", "tni/polri"],
      USIA: ["0-5 tahun", "6-12 tahun", "13-17 tahun", "18-25 tahun", "26-35 tahun", "36-45 tahun", "46-55 tahun", "56-65 tahun", "65+ tahun"],
      DUSUN: ["Dusun A", "Dusun B", "Dusun C", "Dusun D"],
      KEPALA_KELUARGA: ["kepala keluarga"],
      WAJIB_PILIH: ["wajib pilih"],
      ANAK_ANAK: ["anak-anak"]
    };
    if (!validKeys[data.type]?.includes(data.key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "zodErrors.invalid_value",
        path: ["key"]
      });
    }
  });

  static update: ZodType = z.object({
    value: z.coerce
      .number({ message: "zodErrors.invalid_type" })
      .int({ message: "zodErrors.invalid_type" })
      .min(0, { message: "zodErrors.min_value" }),
  });
}
