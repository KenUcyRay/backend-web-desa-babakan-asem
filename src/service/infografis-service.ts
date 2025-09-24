import { TFunction } from "i18next";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  BansosCreateRequest,
  ExtraIdmUpdateRequest,
  IdmCreateRequest,
  IdmUpdateRequest,
  SdgsCreateRequest,
  SdgsUpdateRequest,
} from "../model/infografis-model";
import { InfografisValidation } from "@/validation/infografis-validation";
import { Validation } from "../validation/validation";

export class InfografisService {
  static async getIdm() {
    const idm = await prismaClient.idm.findMany({
      orderBy: {
        year: "asc",
      },
    });

    return { idm: idm };
  }

  static async getBansos() {
    const bansos = await prismaClient.socialAssistance.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return { bansos: bansos };
  }

  static async getSdgs() {
    const sdgs = await prismaClient.sdgs.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return { sdgs: sdgs };
  }
  static async getExtraIdm() {
    const extraIdm = await prismaClient.extraIdm.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return { extraIdm: extraIdm };
  }

  static async updateExtraIdm(
    t: TFunction,
    request: ExtraIdmUpdateRequest,
    id: string
  ) {
    Validation.validate(InfografisValidation.updateExtraIdm, request);

    const extraIdmExists = await prismaClient.extraIdm.findUnique({
      where: { id: id },
    });
    if (!extraIdmExists) {
      throw new ResponseError(404, t("infografis.extra_idm_not_found"));
    }

    const updatedExtraIdm = await prismaClient.extraIdm.update({
      where: { id: id },
      data: request,
    });

    return { extraIdm: updatedExtraIdm };
  }

  static async createIdm(request: IdmCreateRequest) {
    Validation.validate(InfografisValidation.createIdm, request);

    const idm = await prismaClient.idm.create({
      data: request,
    });

    return { idm: idm };
  }

  static async updateIdm(
    t: TFunction,
    idmId: string,
    request: IdmUpdateRequest
  ) {
    Validation.validate(InfografisValidation.updateIdm, request);

    const idmExists = await prismaClient.idm.findUnique({
      where: { id: idmId },
    });
    if (!idmExists) {
      throw new ResponseError(404, t("infografis.idm_not_found"));
    }

    const updatedIdm = await prismaClient.idm.update({
      where: { id: idmId },
      data: request,
    });

    return { idm: updatedIdm };
  }

  static async deleteIdm(t: TFunction, idmId: string) {
    const idmExists = await prismaClient.idm.findUnique({
      where: { id: idmId },
    });
    if (!idmExists) {
      throw new ResponseError(404, t("infografis.idm_not_found"));
    }

    await prismaClient.idm.delete({
      where: { id: idmId },
    });
  }

  static async createBansos(request: BansosCreateRequest) {
    Validation.validate(InfografisValidation.createBansos, request);

    const bansos = await prismaClient.socialAssistance.create({
      data: request,
    });

    return { bansos: bansos };
  }

  static async updateBansos(t: TFunction, bansosId: string, request: any) {
    Validation.validate(InfografisValidation.updateBansos, request);

    const bansosExists = await prismaClient.socialAssistance.findUnique({
      where: { id: bansosId },
    });
    if (!bansosExists) {
      throw new ResponseError(404, t("infografis.bansos_not_found"));
    }

    const updatedBansos = await prismaClient.socialAssistance.update({
      where: { id: bansosId },
      data: request,
    });

    return { bansos: updatedBansos };
  }

  static async deleteBansos(t: TFunction, bansosId: string) {
    const bansosExists = await prismaClient.socialAssistance.findUnique({
      where: { id: bansosId },
    });

    if (!bansosExists) {
      throw new ResponseError(404, t("infografis.bansos_not_found"));
    }

    await prismaClient.socialAssistance.delete({
      where: { id: bansosId },
    });
  }

  static async createSdgs(t: TFunction, request: SdgsCreateRequest) {
    Validation.validate(InfografisValidation.createSdgs, request);

    // Check if SDG with same name already exists
    const existingSdg = await prismaClient.sdgs.findFirst({
      where: { name: request.name },
    });
    
    if (existingSdg) {
      throw new ResponseError(400, "Data sudah ada", "DUPLICATE_ENTRY");
    }

    const sdg = await prismaClient.sdgs.create({
      data: request,
    });

    return {
      success: true,
      message: "SDG berhasil dibuat",
      data: sdg,
    };
  }

  static async updateSdgs(
    t: TFunction,
    request: SdgsUpdateRequest,
    sdgId: string
  ) {
    Validation.validate(InfografisValidation.updateSdgs, request);
    
    const sdgExists = await prismaClient.sdgs.findUnique({
      where: { id: sdgId },
    });
    if (!sdgExists) {
      throw new ResponseError(404, t("infografis.sdgs_not_found"));
    }

    const updatedSdgs = await prismaClient.sdgs.update({
      where: { id: sdgId },
      data: request,
    });

    return {
      success: true,
      message: "SDG berhasil diperbarui",
      data: updatedSdgs,
    };
  }
}
