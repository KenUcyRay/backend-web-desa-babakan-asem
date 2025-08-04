import { prismaClient } from "@/application/database";
import { QueryResidentRequest } from "@/model/resident-model";
import { ResidentValidation } from "@/validation/resident-validation";
import { Validation } from "@/validation/validation";
import { date } from "zod";
import { ResponseError } from "@/error/response-error";
import { TFunction } from "i18next";

export class ResidentService {
  static async getAll(query: QueryResidentRequest) {
    const validation = Validation.validate(ResidentValidation.query, query);

    const residents = await prismaClient.resident.findMany({
      where: {
        resident_type: validation.type,
      },
    });

    return { data: residents };
  }

  static async update(t: TFunction, id: string, request: any) {
    const resident = await prismaClient.resident.findUnique({
      where: { id },
    });

    if (!resident) {
      throw new ResponseError(404, t("resident.not_found"));
    }

    const validation = Validation.validate(ResidentValidation.update, request);

    const updatedResident = await prismaClient.resident.update({
      where: { id },
      data: validation,
    });

    return { data: updatedResident };
  }
}
