import { Request, Response, NextFunction } from "express";
import { badRequest, unauthorized } from "../utils/api-error.js";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function requireUserid(req: Request, _res: Response, next: NextFunction) {
  const userIdHeader = req.headers["x-user-id"];
  if (!userIdHeader || Array.isArray(userIdHeader) || typeof userIdHeader !== "string") {
    throw unauthorized("User ID is required in headers");
  }

  const userId = Number(userIdHeader);
  if (Number.isNaN(userId)) {
    throw badRequest("Invalid User ID in headers");
  }

  req.userId = userId;
  next();
}
