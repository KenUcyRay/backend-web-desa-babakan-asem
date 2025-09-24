import { prismaClient } from "@/application/database";
import { ResponseError } from "@/error/response-error";
import { CreateExtraIdmRequest, ExtraIdmResponse, toExtraIdmResponse } from "@/model/extra-idm-model";
import { ExtraIdmValidation } from "@/validation/extra-idm-validation";
import { Validation } from "@/validation/validation";
import { StatusDesa } from "@prisma/client";

export class ExtraIdmService {
  static async getStatus(): Promise<ExtraIdmResponse | null> {
    const existingExtraIdm = await prismaClient.extraIdm.findFirst();
    return existingExtraIdm ? toExtraIdmResponse(existingExtraIdm) : null;
  }

  static async create(request: CreateExtraIdmRequest): Promise<ExtraIdmResponse> {
    const createRequest = Validation.validate(ExtraIdmValidation.create, request);

    const existingExtraIdm = await prismaClient.extraIdm.findFirst();

    if (existingExtraIdm) {
      const updateData: any = {};
      
      if (createRequest.status_desa) {
        updateData.status_desa = createRequest.status_desa;
      }
      
      if (createRequest.type && createRequest.value !== undefined) {
        updateData[createRequest.type] = createRequest.value;
      }

      const updatedExtraIdm = await prismaClient.extraIdm.update({
        where: { id: existingExtraIdm.id },
        data: updateData
      });

      return toExtraIdmResponse(updatedExtraIdm);
    } else {
      const newData = {
        status_desa: createRequest.status_desa || StatusDesa.MAJU,
        sosial: 0.0,
        ekonomi: 0.0,
        lingkungan: 0.0
      };

      if (createRequest.type && createRequest.value !== undefined) {
        if (createRequest.type === 'sosial') {
          newData.sosial = createRequest.value;
        } else if (createRequest.type === 'ekonomi') {
          newData.ekonomi = createRequest.value;
        } else if (createRequest.type === 'lingkungan') {
          newData.lingkungan = createRequest.value;
        }
      }

      const newExtraIdm = await prismaClient.extraIdm.create({
        data: newData
      });

      return toExtraIdmResponse(newExtraIdm);
    }
  }
}