import { Router } from "express";
import { ProfileController } from "../controller/profile.controller.js";
import { ProfileRepository } from "../repository/profile.repository.js";
import { ProfileService } from "../service/profile.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { validate } from "../utils/validation.js";
import { updateProfileValidation } from "../middleware/profile.validation.js";
import prismaInstance from "../database.js";

const repo = new ProfileRepository(prismaInstance);
const service = new ProfileService(repo);
const controller = new ProfileController(service);

const router = Router();

/**
 * @swagger
 * /profile:
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
 * /profile:
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
 *                 description: Profile picture (max 2MB, JPEG/PNG/GIF/WebP)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error or file too large
 */
router.put(
  "/",
  authenticate,
  upload.single("avatar"), // Single file upload for avatar
  validate(updateProfileValidation),
  controller.updateProfileHandler,
);

export default router;
