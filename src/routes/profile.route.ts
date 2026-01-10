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
 * tags:
 *   name: Profile
 *   description: User profile management
 */

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
 *       401:
 *         description: Unauthorized
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
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 maxLength: 100
 *                 example: "John Doe"
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Suka olahraga dan belajar hal baru"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture (max 2MB)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

router.put(
  "/",
  authenticate,
  upload.single("avatar"),
  validate(updateProfileValidation),
  controller.updateProfileHandler
);

export default router;
