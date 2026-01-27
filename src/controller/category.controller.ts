import type { Request, Response } from "express";
import { successResponse } from "../utils/response.js";
import type { ICategoryService } from "../service/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class CategoryController {
  constructor(private categoryService: ICategoryService) {}

  getAllCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const result = await this.categoryService.getAll(
      {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 50, // 🆕 Limit lebih besar karena categories sedikit
        search: req.query.search as any,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as "asc" | "desc") || "asc",
        userId: req.query.userId as string, // Optional: filter by user (admin)
      },
      userId,
    );

    successResponse(
      res,
      "Daftar kategori berhasil diambil",
      result.categories,
      {
        page: result.currentPage,
        limit: Number(req.query.limit) || 50,
        total: result.total,
        totalPages: result.totalPages,
      },
    );
  });

  getSystemCategoriesHandler = asyncHandler(
    async (_req: Request, res: Response) => {
      const categories = await this.categoryService.getSystemCategories();
      successResponse(res, "Kategori sistem berhasil diambil", categories);
    },
  );

  getUserCategoriesHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");

      const categories = await this.categoryService.getUserCategories(userId);
      successResponse(res, "Kategori custom berhasil diambil", categories);
    },
  );

  getCombinedCategoriesHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      if (!userId) throw new Error("Unauthorized");

      const categories =
        await this.categoryService.getCombinedCategories(userId);
      successResponse(res, "Semua kategori berhasil diambil", categories);
    },
  );

  getCategoryByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const categoryId = req.params.id;
    if (!categoryId) throw new Error("Category ID diperlukan");

    const category = await this.categoryService.getCategoryById(
      categoryId,
      userId,
    );
    successResponse(res, "Kategori berhasil diambil", category);
  });

  createCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const { name, description, color, icon } = req.body;

    if (!name) throw new Error("Nama kategori diperlukan");

    const category = await this.categoryService.createCategory({
      name,
      description,
      color,
      icon,
      userId,
    });

    successResponse(res, "Kategori berhasil dibuat", category, null, 201);
  });

  updateCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const categoryId = req.params.id;
    if (!categoryId) throw new Error("Category ID diperlukan");

    const category = await this.categoryService.updateCategory(
      categoryId,
      req.body,
      userId,
    );
    successResponse(res, "Kategori berhasil diupdate", category);
  });

  deleteCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const categoryId = req.params.id;
    if (!categoryId) throw new Error("Category ID diperlukan");

    const deleted = await this.categoryService.deleteCategory(
      categoryId,
      userId,
    );
    successResponse(res, "Kategori berhasil dihapus", deleted);
  });
}
