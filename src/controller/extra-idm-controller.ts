import { ExtraIdmService } from "@/service/extra-idm-service";
import { UserRequest } from "@/type/user-request";
import { Response, NextFunction } from "express";

export class ExtraIdmController {
  static async getStatus(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await ExtraIdmService.getStatus();
      res.status(200).json({
        success: true,
        data: response,
        exists: !!response
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await ExtraIdmService.create(req.body);
      
      let message = "Data berhasil dibuat";
      
      if (req.body.type) {
        message = `Dimensi ${req.body.type} berhasil dibuat`;
      } else if (req.body.status_desa) {
        message = "Status desa berhasil dibuat";
      }

      res.status(201).json({
        success: true,
        message,
        data: response
      });
    } catch (error) {
      next(error);
    }
  }
}