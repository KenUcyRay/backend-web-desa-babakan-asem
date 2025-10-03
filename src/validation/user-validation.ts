import { Role } from "@prisma/client";
import { z, ZodType } from "zod";

export class UserValidation {
  static register: ZodType = z
    .object({
      name: z
        .string({ message: "zodErrors.required" })
        .max(255, { message: "zodErrors.max_length" }),
      phone_number: z
        .string({ message: "zodErrors.required" })
        .max(20, { message: "zodErrors.max_length" })
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
          message: "zodErrors.invalid_format",
        }),
      email: z
        .string({ message: "zodErrors.required" })
        .email({ message: "zodErrors.email" })
        .max(255, { message: "zodErrors.max_length" }),
      password: z
        .string({ message: "zodErrors.required" })
        .min(6, { message: "zodErrors.min_length" })
        .max(255, { message: "zodErrors.max_length" }),
      confirm_password: z
        .string({ message: "zodErrors.required" })
        .min(6, { message: "zodErrors.min_length" })
        .max(255, { message: "zodErrors.max_length" }),
      remember_me: z.boolean({ message: "zodErrors.required" }),
      recaptcha_token: z.string({ message: "zodErrors.required" }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "validation.password_mismatch",
      path: ["confirm_password"],
    });

  static login: ZodType = z
    .object({
      phone_number: z
        .string({ message: "zodErrors.invalid_type" })
        .max(20, { message: "zodErrors.max_length" })
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
          message: "zodErrors.invalid_format",
        })
        .optional(),
      email: z
        .string({ message: "zodErrors.invalid_type" })
        .email({ message: "zodErrors.email" })
        .max(255, { message: "zodErrors.max_length" })
        .optional(),
      password: z
        .string({ message: "zodErrors.required" })
        .min(6, { message: "zodErrors.min_length" })
        .max(255, { message: "zodErrors.max_length" }),
      remember_me: z.boolean({ message: "zodErrors.required" }),
      recaptcha_token: z.string({ message: "zodErrors.required" }),
    })
    .refine(
      (data) => {
        const emailFilled = !!data.email;
        const phoneFilled = !!data.phone_number;
        return emailFilled !== phoneFilled;
      },
      {
        message: "validation.email_or_phone_required",
        path: ["email", "phone_number"],
      }
    );

  static update: ZodType = z
    .object({
      name: z.string().max(255).optional(),
      phone_number: z
        .string()
        .max(20)
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
          message: "Phone number is not valid",
        })
        .optional(),
      email: z.string().email().max(255).optional(),
      password: z.string().min(6).max(255).optional(),
      confirm_password: z.string().min(6).max(255).optional(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Password and confirmation do not match",
      path: ["confirm_password"],
    });

  static queryUser: ZodType = z.object({
    page: z.coerce.number().int().min(0).default(1),
    size: z.coerce.number().int().min(0).default(10),
    role: z
      .nativeEnum(Role)
      .optional()
      .or(z.literal("").transform(() => undefined)),
  });

  static createUser: ZodType = z
    .object({
      name: z.string().max(255),
      email: z.string().email().max(255),
      phone_number: z
        .string()
        .max(20)
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
          message: "Phone number is not valid",
        }),
      password: z.string().min(6),
      confirm_password: z.string().min(6),
      role: z.nativeEnum(Role),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Password and confirmation do not match",
      path: ["confirm_password"],
    });

  static updateRole: ZodType = z.object({
    role: z.nativeEnum(Role),
  });

  static forgotPassword: ZodType = z.object({
    email: z.string().email(),
  });

  static resetPassword: ZodType = z.object({
    password: z.string().min(6),
    confirm_password: z.string().min(6),
  });
}
