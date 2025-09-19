import { EmergencyService } from "@/service/emergency-service";
import { UserRequest } from "@/type/user-request";
import { Request, Response, NextFunction } from "express";

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
    if (req.user?.role !== "REGULAR") {
      return res.status(403).json({
        error: "Hanya user REGULAR yang bisa menggunakan emergency",
      });
    }

    const response = await EmergencyService.create(req.user!, req.body);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}
  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
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
