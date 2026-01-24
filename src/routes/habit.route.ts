import { Router } from "express";
import { HabitController } from "../controller/habit.controller.js";
import { HabitRepository } from "../repository/habit.repository.js";
import { HabitService } from "../service/habit.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../utils/validation.js";
import {
  createHabitValidation,
  updateHabitValidation,
} from "../middleware/habit.validation.js";
import prismaInstance from "../database.js";

const repo = new HabitRepository(prismaInstance);
const service = new HabitService(repo);
const controller = new HabitController(service);

const router = Router();

/**
 * @swagger
 * /habit:
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
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
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
 * /habit/today-status:
 *   get:
 *     summary: Get habits with today's check-in status
 *     description: Get all active habits with today's check-in completion status
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Habits with today's check-in status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Habits dengan status check-in hari ini berhasil diambil"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                         example: "Minum Air 8 Gelas"
 *                       description:
 *                         type: string
 *                         example: "Minimal 8 gelas air setiap hari"
 *                       frequency:
 *                         type: string
 *                         enum: [DAILY, WEEKLY, MONTHLY, YEARLY]
 *                         example: "DAILY"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                             example: "HEALTHY"
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                       currentStreak:
 *                         type: integer
 *                         example: 14
 *                       longestStreak:
 *                         type: integer
 *                         example: 30
 *                       isCheckedToday:
 *                         type: boolean
 *                         description: "Whether habit has been checked in today"
 *                         example: true
 *                       todayCheckIn:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           date:
 *                             type: string
 *                             format: date-time
 *                           note:
 *                             type: string
 *                             example: "Sudah minum 8 gelas"
 *                       canCheckInToday:
 *                         type: boolean
 *                         description: "Whether user can check in today"
 *                         example: false
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/today-status",
  authenticate,
  controller.getHabitsWithTodayStatusHandler,
);

/**
 * @swagger
 * /habit:
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
 *               - startDate
 *               - frequency
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Minum Air 8 Gelas"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Minimal 8 gelas air setiap hari"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: "Start date in YYYY-MM-DD format"
 *                 example: "2024-01-15"
 *               frequency:
 *                 type: string
 *                 enum:
 *                   - DAILY
 *                   - WEEKLY
 *                   - MONTHLY
 *                   - YEARLY
 *                 example: "DAILY"
 *     responses:
 *       201:
 *         description: Habit created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authenticate,
  validate(createHabitValidation),
  controller.createHabitHandler,
);

/**
 * @swagger
 * /habit/{id}:
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
 *     responses:
 *       200:
 *         description: Habit details
 *       404:
 *         description: Habit not found
 */
router.get("/:id", authenticate, controller.getHabitByIdHandler);

/**
 * @swagger
 * /habit/{id}:
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
 *     requestBody:
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
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T00:00:00Z"
 *               frequency:
 *                 type: string
 *                 enum:
 *                   - DAILY
 *                   - WEEKLY
 *                   - MONTHLY
 *                   - YEARLY
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *       404:
 *         description: Habit not found
 */
router.put(
  "/:id",
  authenticate,
  validate(updateHabitValidation),
  controller.updateHabitHandler,
);

/**
 * @swagger
 * /habit/{id}:
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
 *     responses:
 *       200:
 *         description: Habit deleted successfully
 *       404:
 *         description: Habit not found
 */
router.delete("/:id", authenticate, controller.deleteHabitHandler);

/**
 * @swagger
 * /habit/{id}/toggle:
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
 *     responses:
 *       200:
 *         description: Habit status toggled
 *       404:
 *         description: Habit not found
 */
router.put("/:id/toggle", authenticate, controller.toggleHabitHandler);

export default router;
