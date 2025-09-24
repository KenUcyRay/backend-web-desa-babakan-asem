import { ResidentService } from "@/service/resident-service";
import { UserRequest } from "@/type/user-request";
import { Request, Response, NextFunction } from "express";
import { I18nRequest } from "@/type/i18n-request";

export class ResidentController {
  static async create(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ResidentService.create(req.t, req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ResidentService.getAll(req.query as any);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ResidentService.update(
        req.t,
        req.params.id,
        req.body
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
