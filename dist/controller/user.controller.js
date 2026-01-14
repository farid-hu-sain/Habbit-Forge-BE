import { successResponse } from "../utils/response";
import { UserService } from "../service/user.service";
import { asyncHandler } from "../utils/asyncHandler";
export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    getCurrentUserHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const user = await this.userService.getCurrentUser(userId);
        successResponse(res, "User data retrieved", user);
    });
}
//# sourceMappingURL=user.controller.js.map