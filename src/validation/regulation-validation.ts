import { z, ZodType } from "zod";

export class RegulationValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(255),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 10),
  });

  static readonly UPDATE: ZodType = z.object({
    title: z.string().min(1).max(255).optional(),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 10).optional(),
  });
}