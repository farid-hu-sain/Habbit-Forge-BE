import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import { CategoryRepository } from "../repository/category.repository.js";
import { CategoryService } from "../service/category.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../utils/validation.js";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../middleware/category.validation.js";
import prismaInstance from "../database.js";

const repo = new CategoryRepository(prismaInstance);
const service = new CategoryService(repo);
const controller = new CategoryController(service);

const router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories (system + user's custom)
 *     tags: [Categories]
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
 *           default: 50
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", authenticate, controller.getAllCategoryHandler);

/**
 * @swagger
 * /category/system:
 *   get:
 *     summary: Get system categories only
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System categories
 */
router.get("/system", authenticate, controller.getSystemCategoriesHandler);

/**
 * @swagger
 * /category/user:
 *   get:
 *     summary: Get user's custom categories only
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's custom categories
 */
router.get("/user", authenticate, controller.getUserCategoriesHandler);

/**
 * @swagger
 * /category/combined:
 *   get:
 *     summary: Get combined categories (system + user's custom)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All categories
 */
router.get("/combined", authenticate, controller.getCombinedCategoriesHandler);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
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
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get("/:id", authenticate, controller.getCategoryByIdHandler);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create custom category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 200
 *               color:
 *                 type: string
 *                 pattern: "^#[0-9A-F]{6}$"
 *               icon:
 *                 type: string
 *                 maxLength: 10
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error or duplicate name
 */
router.post(
  "/",
  authenticate,
  validate(createCategoryValidation),
  controller.createCategoryHandler,
);

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update custom category
 *     tags: [Categories]
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
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 200
 *               color:
 *                 type: string
 *                 pattern: "^#[0-9A-F]{6}$"
 *               icon:
 *                 type: string
 *                 maxLength: 10
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       403:
 *         description: Cannot update system category
 */
router.put(
  "/:id",
  authenticate,
  validate(updateCategoryValidation),
  controller.updateCategoryHandler,
);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete custom category
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 *       403:
 *         description: Cannot delete system category or category in use
 */
router.delete("/:id", authenticate, controller.deleteCategoryHandler);

export default router;
