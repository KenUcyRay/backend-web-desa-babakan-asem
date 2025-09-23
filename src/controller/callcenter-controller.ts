import { Request, Response, NextFunction } from "express";
import { CallCenterService } from "@/service/callcenter-service";

export class CallCenterController {
  // ✅ Method untuk ADMIN - tampilkan semua data (aktif & nonaktif)
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CallCenterService.getAll(req.query);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // ✅ Method untuk PUBLIC - hanya tampilkan yang aktif
  static async getAllPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CallCenterService.getAllPublic(req.query);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CallCenterService.create(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CallCenterService.update(req.params.id, req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CallCenterService.delete(req.params.id);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  // ✅ toggle aktif/nonaktif call center / whatsapp
  static async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      const response = await CallCenterService.update(id, { is_active });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}