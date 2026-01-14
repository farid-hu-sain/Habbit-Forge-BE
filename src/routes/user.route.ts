import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { authenticate } from "../middleware/auth.middleware";

const userService = new UserService();
const controller = new UserController(userService);

const router = Router();

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, controller.getCurrentUserHandler);

export default router;