import { NextFunction, Request, Response } from "express";
import { RegulationService } from "../service/regulation-service";
import { UserRequest } from "../type/user-request";
import path from "path";

export class RegulationController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body;
      const file = req.file;

      const result = await RegulationService.create(request, file!);

      res.status(201).json({
        success: true,
        message: "Regulation created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RegulationService.getAll();

      res.status(200).json({
        success: true,
        message: "Regulations retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await RegulationService.getById(id);

      res.status(200).json({
        success: true,
        message: "Regulation retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const request = req.body;
      const file = req.file;

      const result = await RegulationService.update(id, request, file);

      res.status(200).json({
        success: true,
        message: "Regulation updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      await RegulationService.delete(id);

      res.status(200).json({
        success: true,
        message: "Regulation deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async download(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const { filePath, fileName } = await RegulationService.downloadFile(id);

      res.download(filePath, fileName);
    } catch (error) {
      next(error);
    }
  }

  static async preview(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    const { filePath, fileName } = await RegulationService.downloadFile(id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.sendFile(path.resolve(filePath)); // ✅ pastikan absolute path
  } catch (error: any) {
    console.error("❌ Error preview regulation file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
    next(error);
  }
}
}