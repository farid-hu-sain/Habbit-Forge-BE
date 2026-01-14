import type { Request, Response } from "express";
import type { IHabitService } from "../service/habit.service";
export declare class HabitController {
    private habitService;
    constructor(habitService: IHabitService);
    getAllHabitHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getHabitByIdHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createHabitHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateHabitHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteHabitHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    toggleHabitHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=habit.controller.d.ts.map