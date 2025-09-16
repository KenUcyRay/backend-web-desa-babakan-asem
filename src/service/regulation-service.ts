import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { RegulationRequest, RegulationResponse, RegulationUpdateRequest } from "../model/regulation-model";
import { RegulationValidation } from "../validation/regulation-validation";
import { Validation } from "../validation/validation";
import fs from "fs";
import path from "path";

export class RegulationService {
  // Helper function to convert BigInt to number for JSON serialization
  private static convertBigIntToNumber(value: bigint | null): number | null {
    return value ? Number(value) : null;
  }

  // Helper function to format regulation response
  private static formatRegulationResponse(regulation: any): RegulationResponse {
    return {
      id: regulation.id,
      title: regulation.title,
      year: regulation.year,
      filePath: regulation.filePath,
      fileName: regulation.fileName,
      fileSize: this.convertBigIntToNumber(regulation.fileSize),
      createdAt: regulation.createdAt,
      updatedAt: regulation.updatedAt,
    };
  }

  static async create(request: RegulationRequest, file: Express.Multer.File): Promise<RegulationResponse> {
    // 🔹 Normalisasi input: year dari multipart selalu string
    const normalizedReq: any = {
      ...request,
      year: request.year !== undefined ? Number((request as any).year) : undefined,
    };

    if (normalizedReq.year !== undefined && Number.isNaN(normalizedReq.year)) {
      throw new ResponseError(400, "Year must be a valid number");
    }

    const createRequest = Validation.validate(RegulationValidation.CREATE, normalizedReq);

    if (!file) {
      throw new ResponseError(400, "PDF file is required");
    }

    // 🔹 Pastikan file path absolute (supaya fs.existsSync aman)
    const storedPath = path.isAbsolute(file.path) ? file.path : path.join(process.cwd(), file.path);

    const regulation = await prismaClient.regulation.create({
      data: {
        title: createRequest.title,
        year: createRequest.year,
        filePath: storedPath,
        fileName: file.originalname,
        fileSize: file.size ? BigInt(file.size) : null,
      },
    });

    return this.formatRegulationResponse(regulation);
  }

  static async getAll(): Promise<RegulationResponse[]> {
    const regulations = await prismaClient.regulation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return regulations.map((regulation) => this.formatRegulationResponse(regulation));
  }

  static async getById(id: number): Promise<RegulationResponse> {
    const regulation = await prismaClient.regulation.findUnique({ where: { id } });
    if (!regulation) {
      throw new ResponseError(404, "Regulation not found");
    }

    return this.formatRegulationResponse(regulation);
  }

  static async update(id: number, request: RegulationUpdateRequest, file?: Express.Multer.File): Promise<RegulationResponse> {
    // 🔹 Normalisasi year juga di update
    const normalizedReq: any = {
      ...request,
      year: request.year !== undefined ? Number((request as any).year) : undefined,
    };

    if (normalizedReq.year !== undefined && Number.isNaN(normalizedReq.year)) {
      throw new ResponseError(400, "Year must be a valid number");
    }

    const updateRequest = Validation.validate(RegulationValidation.UPDATE, normalizedReq);

    const existingRegulation = await prismaClient.regulation.findUnique({ where: { id } });
    if (!existingRegulation) {
      throw new ResponseError(404, "Regulation not found");
    }

    const updateData: any = { ...updateRequest };

    if (file) {
      // Hapus file lama kalau ada
      if (fs.existsSync(existingRegulation.filePath)) {
        fs.unlinkSync(existingRegulation.filePath);
      }

      const storedPath = path.isAbsolute(file.path) ? file.path : path.join(process.cwd(), file.path);
      updateData.filePath = storedPath;
      updateData.fileName = file.originalname;
      updateData.fileSize = file.size ? BigInt(file.size) : null;
    }

    const regulation = await prismaClient.regulation.update({
      where: { id },
      data: updateData,
    });

    return this.formatRegulationResponse(regulation);
  }

  static async delete(id: number): Promise<void> {
    const regulation = await prismaClient.regulation.findUnique({ where: { id } });
    if (!regulation) {
      throw new ResponseError(404, "Regulation not found");
    }

    if (fs.existsSync(regulation.filePath)) {
      fs.unlinkSync(regulation.filePath);
    }

    await prismaClient.regulation.delete({ where: { id } });
  }

  static async downloadFile(id: number): Promise<{ filePath: string; fileName: string }> {
    const regulation = await prismaClient.regulation.findUnique({ where: { id } });
    if (!regulation) {
      throw new ResponseError(404, "Regulation not found");
    }

    const stored = regulation.filePath;
    const absolutePath = path.isAbsolute(stored) ? stored : path.join(process.cwd(), stored);

    if (!fs.existsSync(absolutePath)) {
      throw new ResponseError(404, "File not found");
    }

    return { filePath: absolutePath, fileName: regulation.fileName };
  }
}