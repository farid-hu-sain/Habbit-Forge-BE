import type { Request, Response } from "express";
import type { ICheckInService } from "../service/checkIn.service";
export declare class CheckInController {
    private checkInService;
    constructor(checkInService: ICheckInService);
    getCheckInByIdHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createCheckInHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCheckInHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteCheckInHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=checkIn.controller.d.ts.map