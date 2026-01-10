import { Router } from "express";
import { HabitController } from "../controller/habit.controller";
import { HabitRepository } from "../repository/habit.repository";
import { HabitService } from "../service/habit.service";
import { authenticate } from "../middleware/auth.middleware";
import { checkHabitOwnership } from "../middleware/ownership.middleware";
import { validate } from "../utils/validation";
import {
  createHabitValidation,
  updateHabitValidation,
} from "../middleware/habit.validation";
import prismaInstance from "../database";

const repo = new HabitRepository(prismaInstance);
const service = new HabitService(repo);
const controller = new HabitController(service);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Habits
 *   description: Habit management
 */

/**
 * @swagger
 * /api/habit:
 *   get:
 *     summary: Get all habits for current user
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by habit title
 *     responses:
 *       200:
 *         description: List of habits
 *       401:
 *         description: Unauthorized
 */

router.get("/", authenticate, controller.getAllHabitHandler);

/**
 * @swagger
 * /api/habit:
 *   post:
 *     summary: Create new habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Minum air 8 gelas"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Minimal 8 gelas air setiap hari"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       201:
 *         description: Habit created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

router.post(
  "/",
  authenticate,
  validate(createHabitValidation),
  controller.createHabitHandler
);
/**
 * @swagger
 * /api/habit/{id}:
 *   get:
 *     summary: Get habit by ID
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Habit ID
 *     responses:
 *       200:
 *         description: Habit details
 *       404:
 *         description: Habit not found
 *       403:
 *         description: Forbidden (not owner)
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  authenticate,
  checkHabitOwnership,
  controller.getHabitByIdHandler
);

/**
 * @swagger
 * /api/habit/{id}:
 *   put:
 *     summary: Update habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Habit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               isActive:
 *                 type: boolean
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *       404:
 *         description: Habit not found
 *       403:
 *         description: Forbidden (not owner)
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  authenticate,
  checkHabitOwnership,
  validate(updateHabitValidation),
  controller.updateHabitHandler
);

/**
 * @swagger
 * /api/habit/{id}:
 *   delete:
 *     summary: Delete habit (soft delete)
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Habit ID
 *     responses:
 *       200:
 *         description: Habit deleted successfully
 *       404:
 *         description: Habit not found
 *       403:
 *         description: Forbidden (not owner)
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  authenticate,
  checkHabitOwnership,
  controller.deleteHabitHandler
);

/**
 * @swagger
 * /api/habit/{id}/toggle:
 *   put:
 *     summary: Toggle habit active status
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Habit ID
 *     responses:
 *       200:
 *         description: Habit status toggled
 *       404:
 *         description: Habit not found
 *       403:
 *         description: Forbidden (not owner)
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id/toggle",
  authenticate,
  checkHabitOwnership,
  controller.toggleHabitHandler
);

export default router;
