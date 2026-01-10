import { Router } from "express";
import { CheckInController } from "../controller/checkIn.controller";
import { CheckInRepository } from "../repository/checkIn.repository";
import { CheckInService } from "../service/checkIn.service";
import { authenticate } from "../middleware/auth.middleware";
import {
  checkHabitAccessForCheckIn,
  checkCheckInOwnership,
} from "../middleware/ownership.middleware";
import { validate } from "../utils/validation";
import {
  createCheckInValidation,
  updateCheckInValidation,
} from "../middleware/checkIn.validation";
import prismaInstance from "../database";

const repo = new CheckInRepository(prismaInstance);
const service = new CheckInService(repo);
const controller = new CheckInController(service);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CheckIns
 *   description: Daily check-in management
 */

/**
 * @swagger
 * /api/checkIn/{id}:
 *   get:
 *     summary: Get check-in by ID
 *     tags: [CheckIns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Check-in ID
 *     responses:
 *       200:
 *         description: Check-in details
 *       404:
 *         description: Check-in not found
 *       403:
 *         description: Forbidden (not owner)
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  authenticate,
  checkCheckInOwnership,
  controller.getCheckInByIdHandler
);

/**
 * @swagger
 * /api/checkIn:
 *   post:
 *     summary: Create daily check-in
 *     tags: [CheckIns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - habitId
 *             properties:
 *               habitId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               note:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Sudah minum 8 gelas hari ini"
 *     responses:
 *       201:
 *         description: Check-in created successfully
 *       400:
 *         description: Already checked in today
 *       404:
 *         description: Habit not found or not active
 *       403:
 *         description: Forbidden (not owner)
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createCheckInValidation),
  checkHabitAccessForCheckIn,
  controller.createCheckInHandler
);

/**
 * @swagger
 * /api/checkIn/{id}:
 *   put:
 *     summary: Update check-in note
 *     tags: [CheckIns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Check-in ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Check-in updated successfully
 *       404:
 *         description: Check-in not found
 *       403:
 *         description: Forbidden (not owner)
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  authenticate,
  checkCheckInOwnership,
  validate(updateCheckInValidation),
  controller.updateCheckInHandler
);

/**
 * @swagger
 * /api/checkIn/{id}:
 *   delete:
 *     summary: Delete check-in
 *     tags: [CheckIns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Check-in ID
 *     responses:
 *       200:
 *         description: Check-in deleted successfully
 *       404:
 *         description: Check-in not found
 *       403:
 *         description: Forbidden (not owner)
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  authenticate,
  checkCheckInOwnership,
  controller.deleteCheckInHandler
);

export default router;
