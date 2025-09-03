import { NextFunction, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { AxiosError } from "axios";
import { I18nRequest } from "@/type/i18n-request";

export const errorMiddleware = (
  error: Error,
  req: I18nRequest,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    // Format untuk frontend yang sudah ada dengan support bilingual
    const frontendFormat = {
      name: "ZodError",
      issues: error.issues.map((issue) => {
        const fieldPath = issue.path.join(".");
        const fieldName = req.t(`fields.${fieldPath}`, {
          defaultValue: fieldPath,
        });

        // Jika message sudah berupa key translation, translate langsung
        let message: string;
        if (
          issue.message &&
          (issue.message.startsWith("zodErrors.") ||
            issue.message.startsWith("validation."))
        ) {
          const params: any = { field: fieldName };

          // Add min/max values if available
          if ("minimum" in issue) params.min = issue.minimum;
          if ("maximum" in issue) params.max = issue.maximum;

          message = req.t(issue.message, params) as string;
        } else {
          // Fallback untuk message yang belum menggunakan key
          message =
            issue.message ||
            req.t("zodErrors.invalid_value", { field: fieldName });
        }

        return {
          ...issue,
          message,
          path: issue.path,
        };
      }),
    };

    res.status(400).json({
      errors: frontendFormat,
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      errors: error.message,
    });
  } else if (error instanceof AxiosError) {
    res.status(error.response?.status || 500).json({
      errors:
        error.response?.data.error || req.t("common.internal_server_error"),
    });
  } else {
    res.status(500).json({
      errors: req.t("common.internal_server_error"),
    });
  }
};
