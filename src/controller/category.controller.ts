import type { Request, Response } from "express";
import { successResponse } from "../utils/response.js";
import type { ICategoryService } from "../service/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class CategoryController {
  constructor(private categoryService: ICategoryService) {}

  getAllCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.categoryService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as any,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc"
    });

    successResponse(
      res,
      "Daftar kategori berhasil diambil",
      result.category,
      {
        page: result.currentPage,
        limit: Number(req.query.limit) || 10,
        total: result.total,
        totalPages: result.totalPages,
      }
    );
  });

  getCategoryByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.getCategoryById(req.params.id!);
    successResponse(res, "Kategori berhasil diambil", category);
  });
}