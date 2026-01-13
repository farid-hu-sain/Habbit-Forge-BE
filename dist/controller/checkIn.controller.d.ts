import type { Request, Response } from "express";
import type { ICheckInService } from "../service/checkIn.service.js";
export interface ICheckInController {
    getCheckInByIdHandler(req: Request, res: Response): Promise<void>;
    createCheckInHandler(req: Request, res: Response): Promise<void>;
    updateCheckInHandler(req: Request, res: Response): Promise<void>;
    deleteCheckInHandler(req: Request, res: Response): Promise<void>;
}
export declare class CheckInController implements ICheckInController {
    private checkInService;
    constructor(checkInService: ICheckInService);
    getCheckInByIdHandler(req: Request, res: Response): Promise<void>;
    createCheckInHandler(req: Request, res: Response): Promise<void>;
    updateCheckInHandler(req: Request, res: Response): Promise<void>;
    deleteCheckInHandler(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=checkIn.controller.d.ts.map
