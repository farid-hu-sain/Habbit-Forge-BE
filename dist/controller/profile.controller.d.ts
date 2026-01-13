import type { Request, Response } from "express";
import type { IProfileService } from "../service/profile.service.js";
export interface IProfileController {
    getProfileByIdHandler(req: Request, res: Response): Promise<void>;
    updateProfileHandler(req: Request, res: Response): Promise<void>;
}
export declare class ProfileController implements IProfileController {
    private profileService;
    constructor(profileService: IProfileService);
    getProfileByIdHandler(req: Request, res: Response): Promise<void>;
    updateProfileHandler(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=profile.controller.d.ts.map
