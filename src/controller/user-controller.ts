import { QueryUser } from "@/model/user-model";
import { UserService } from "@/service/user-service";
import { I18nRequest } from "@/type/i18n-request";
import { UserRequest } from "@/type/user-request";
import { clearCookie, setCookie } from "@/util/cookie";
import { Request, Response, NextFunction } from "express";

export class UserController {
  static async register(req: I18nRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.register(req.t, req.body);
      setCookie(res, response.token, req.body.remember_me);
      res.status(201).json({
        success: true,
        data: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          phone_number: response.user.phone_number
        },
        token: response.token
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(req: I18nRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.login(req.t, req.body);
      setCookie(res, response.token, req.body.remember_me);
      res.status(200).json({
        success: true,
        data: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          phone_number: response.user.phone_number
        },
        token: response.token
      });
    } catch (error) {
      next(error);
    }
  }
  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      clearCookie(res);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await UserService.delete(req.user!);
      clearCookie(res);
      return res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async profile(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.profile(req.user!);
      return res.status(200).json(response);
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
      const response = await UserService.update(req.user!, req.t, req.body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getAllUser(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUser(
        req.user!,
        req.query as QueryUser
      );
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
  static async createUser(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await UserService.createUser(req.t, req.body, req.user!);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async updateRole(
    req: UserRequest & I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updatedUser = await UserService.updateRole(
        req.t,
        req.params.id,
        req.body
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(
    req: I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.forgotPassword(req.t, req.body);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async verifyResetToken(
    req: I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.verifyResetToken(req.t, req.query.token as string);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
  static async resetPassword(
    req: I18nRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await UserService.resetPassword(
        req.t,
        req.body,
        req.query.token as string
      );
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
