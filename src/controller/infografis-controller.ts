import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { I18nRequest } from "../type/i18n-request";
import { InfografisService } from "../service/infografis-service";

export class InfografisController {
  static async getIdm(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await InfografisService.getIdm();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getBansos(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await InfografisService.getBansos();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getSdgs(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await InfografisService.getSdgs();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getExtraIdm(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await InfografisService.getExtraIdm();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateExtraIdm(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await InfografisService.updateExtraIdm(
        req.t,
        req.body,
        req.params.id
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createIdm(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await InfografisService.createIdm(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateIdm(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await InfografisService.updateIdm(
        req.t,
        req.params.idmId,
        req.body
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteIdm(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await InfografisService.deleteIdm(req.t, req.params.idmId);
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  static async createBansos(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await InfografisService.createBansos(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateBansos(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await InfografisService.updateBansos(
        req.t,
        req.params.bansosId,
        req.body
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteBansos(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await InfografisService.deleteBansos(req.t, req.params.bansosId);
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  static async createSdgs(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await InfografisService.createSdgs(req.t, req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateSdgs(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await InfografisService.updateSdgs(
        req.t,
        req.body,
        req.params.id
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
