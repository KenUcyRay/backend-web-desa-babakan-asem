import { prismaClient } from "@/application/database";
import { CreateResidentRequest, QueryResidentRequest } from "@/model/resident-model";
import { ResidentValidation } from "@/validation/resident-validation";
import { Validation } from "@/validation/validation";
import { date } from "zod";
import { ResponseError } from "@/error/response-error";
import { TFunction } from "i18next";

export class ResidentService {
  static async create(t: TFunction, request: CreateResidentRequest) {
    const validation = Validation.validate(ResidentValidation.create, request);

    // Check if resident with same type and key already exists
    const existingResident = await prismaClient.resident.findFirst({
      where: {
        resident_type: validation.type as any,
        key: validation.key,
      },
    });
    
    if (existingResident) {
      throw new ResponseError(400, "Data sudah ada", "DUPLICATE_ENTRY");
    }

    const resident = await prismaClient.resident.create({
      data: {
        resident_type: validation.type as any,
        key: validation.key,
        value: validation.value,
      },
    });

    return {
      success: true,
      message: "Data penduduk berhasil dibuat",
      data: resident,
    };
  }

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
