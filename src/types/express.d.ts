import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      user?: {
        id: string;
        email?: string;
        username?: string;
      };
    }
  }
}