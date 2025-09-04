import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { I18nRequest } from "../type/i18n-request";
import { AgendaService } from "../service/agenda-service";
import { AgendaType } from "@prisma/client";

export class AgendaController {
  static async getOwn(req: UserRequest, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      let type = req.query.type as string | undefined;
      if (type === AgendaType.PKK) {
        type = AgendaType.PKK;
      } else if (type === AgendaType.KARANG_TARUNA) {
        type = AgendaType.KARANG_TARUNA;
      } else if (type === AgendaType.REGULAR) {
        type = AgendaType.REGULAR;
      } else if (type === AgendaType.BPD) {
        type = AgendaType.BPD;
      } else {
        type = undefined;
      }

      let isPublished: boolean | undefined = undefined;
      if (typeof req.query.is_published !== "undefined") {
        if (req.query.is_published === "true") {
          isPublished = true;
        } else if (req.query.is_published === "false") {
          isPublished = true;
        }
      }
      if (isNaN(page)) {
        page = 1;
      }
      if (isNaN(limit)) {
        limit = 10;
      }
      const response = await AgendaService.getOwn(
        req.user!,
        page,
        limit,
        isPublished,
        type as AgendaType
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async create(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.body.is_published === "false") {
        req.body.is_published = false;
      } else if (req.body.is_published === "true") {
        req.body.is_published = true;
      }
      const response = await AgendaService.create(
        req.t,
        req.body,
        req.user!,
        req.file
      );
      res.status(201).json(response);
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
      if (req.body.is_published === "false") {
        req.body.is_published = false;
      } else if (req.body.is_published === "true") {
        req.body.is_published = true;
      }
      const response = await AgendaService.update(
        req.t,
        req.body,
        req.user!,
        req.params.agendaId,
        req.file
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async delete(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await AgendaService.delete(
        req.t,
        req.params.agendaId,
        req.user!,
        req.header("Authorization")!
      );
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      let type = req.query.type as string | undefined;
      if (type === AgendaType.PKK) {
        type = AgendaType.PKK;
      } else if (type === AgendaType.KARANG_TARUNA) {
        type = AgendaType.KARANG_TARUNA;
      } else if (type === AgendaType.REGULAR) {
        type = AgendaType.REGULAR;
      } else if (type === AgendaType.BPD) {
        type = AgendaType.BPD;
      } else {
        type = undefined;
      }
      const response = await AgendaService.getAll(
        page,
        limit,
        type as AgendaType
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getById(req: I18nRequest, res: Response, next: NextFunction) {
    try {
      const response = await AgendaService.getById(req.t, req.params.agendaId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
