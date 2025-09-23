import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { Role } from "@prisma/client";

export const roleMiddleware = (role: Role | null = null) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    // If role is null, allow all authenticated users
    if (!role) {
      return next();
    }

    // Check if user has the required role or is ADMIN
    if (req.user!.role !== role && req.user!.role !== Role.ADMIN) {
      return res.status(403).json({ 
        error: "Forbidden",
        message: "You don't have permission to access this resource" 
      }).end();
    }
    next();
  };
};