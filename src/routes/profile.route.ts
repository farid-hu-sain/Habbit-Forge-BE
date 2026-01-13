import { Router } from "express";
import { ProfileController } from "../controller/profile.controller";
import { ProfileRepository } from "../repository/profile.repository";
import { ProfileService } from "../service/profile.service";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { validate } from "../utils/validation";
import { updateProfileValidation } from "../middleware/profile.validation";
import prismaInstance from "../database";

const repo = new ProfileRepository(prismaInstance);
const service = new ProfileService(repo);
const controller = new ProfileController(service);

const router = Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details
 *       404:
 *         description: Profile not found
 */
router.get("/", authenticate, controller.getProfileByIdHandler);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 maxLength: 100
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture (max 2MB)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 */
router.put(
  "/",
  authenticate,
  upload.single("avatar"),
  validate(updateProfileValidation),
  controller.updateProfileHandler
);

export default router;