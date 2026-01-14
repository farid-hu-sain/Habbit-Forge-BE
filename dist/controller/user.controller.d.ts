import type { Request, Response } from "express";
import { UserService } from "../service/user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getCurrentUserHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=user.controller.d.ts.map