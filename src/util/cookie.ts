import { Response } from "express";

export const setCookie = (
  res: Response,
  token: string,
  rememberMe: boolean
) => {
  const expired = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days or 1 day
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: expired,
  });
};

export const clearCookie = (res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};
