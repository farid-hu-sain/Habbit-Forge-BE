import type { Request, Response } from "express";
import type { IHabitService } from "../service/habit.service.js";
export interface IHabitController {
    getAllHabitHandler(req: Request, res: Response): Promise<void>;
    getHabitByIdHandler(req: Request, res: Response): Promise<void>;
    createHabitHandler(req: Request, res: Response): Promise<void>;
    updateHabitHandler(req: Request, res: Response): Promise<void>;
    deleteHabitHandler(req: Request, res: Response): Promise<void>;
}
export declare class HabitController implements IHabitController {
    private habitService;
    constructor(habitService: IHabitService);
    getAllHabitHandler(req: Request, res: Response): Promise<void>;
    getHabitByIdHandler(req: Request, res: Response): Promise<void>;
    createHabitHandler(req: Request, res: Response): Promise<void>;
    updateHabitHandler(req: Request, res: Response): Promise<void>;
    deleteHabitHandler(req: Request, res: Response): Promise<void>;
    toggleHabitHandler(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=habit.controller.d.ts.map
