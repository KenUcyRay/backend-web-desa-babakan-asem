import { Request, Response, NextFunction } from "express";
import { ContactService } from "@/service/contact-service";

export class ContactController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ContactService.getAll(req.query);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAllPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ContactService.getAllPublic();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ContactService.create(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ContactService.update(req.params.id, req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ContactService.delete(req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
