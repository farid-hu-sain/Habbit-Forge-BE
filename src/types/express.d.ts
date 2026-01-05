import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      apikey?: string;
      user?: {
        id: number;
        role: string;
      }
    }
  }
}
