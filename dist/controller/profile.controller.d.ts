import type { Request, Response } from "express";
import type { IProfileService } from "../service/profile.service";
export declare class ProfileController {
    private profileService;
    constructor(profileService: IProfileService);
    getProfileByIdHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateProfileHandler: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=profile.controller.d.ts.map