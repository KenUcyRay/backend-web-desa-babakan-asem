import { MapService } from "./../service/map-service";
import { UserRequest } from "@/type/user-request";
import { Response, NextFunction } from "express";

export class MapController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await MapService.create(req.body, req.file);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await MapService.getAll();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await MapService.delete(req.params.id);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      const response = await MapService.update(
        req.params.id,
        req.body,
        req.file
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
