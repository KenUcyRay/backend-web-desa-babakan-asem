import { Response, NextFunction } from "express";
import { ResponseError } from "@/error/response-error";
import { UserRequest } from "@/type/user-request";
import { toUserResponse, UserResponse } from "@/model/user-model";
import { prismaClient } from "../application/database";
import { verifyToken } from "@/util/jwt";

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check token from cookies first, then Authorization header
    let token = req.cookies.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      console.log('❌ No token found in cookies or Authorization header');
      throw new ResponseError(401, "Unauthorized");
    }

    console.log('🔍 Token found, verifying...');
    const userResponse = verifyToken(token) as UserResponse;
    const user = await prismaClient.user.findUnique({
      where: { id: userResponse.id },
    });

    if (!user) {
      console.log('❌ User not found in database');
      throw new ResponseError(401, "Unauthorized");
    }

    console.log('✅ Auth successful for user:', user.email);
    req.user = toUserResponse(user);
    next();
  } catch (error) {
    console.log('❌ Auth middleware error:', error instanceof Error ? error.message : error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
