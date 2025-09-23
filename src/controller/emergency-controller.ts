import { EmergencyService } from "@/service/emergency-service";
import { UserRequest } from "@/type/user-request";
import { Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export class EmergencyController {
  static async getAll(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await EmergencyService.getAll(req.query);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      // Removed role check - any authenticated user can create emergency
      const response = await EmergencyService.create(req.user!, req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      // Only admin can update
      if (req.user?.role !== Role.ADMIN) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Only admin can update emergency status",
        });
      }
      const response = await EmergencyService.update(req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await EmergencyService.delete(req.params.id);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  static async count(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await EmergencyService.count();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
