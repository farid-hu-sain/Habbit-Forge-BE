import { successResponse } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
export class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    getAllCategoryHandler = asyncHandler(async (req, res) => {
        const result = await this.categoryService.getAll({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder || "desc"
        });
        successResponse(res, "Daftar kategori berhasil diambil", result.category, {
            page: result.currentPage,
            limit: Number(req.query.limit) || 10,
            total: result.total,
            totalPages: result.totalPages,
        });
    });
    getCategoryByIdHandler = asyncHandler(async (req, res) => {
        const category = await this.categoryService.getCategoryById(req.params.id);
        successResponse(res, "Kategori berhasil diambil", category);
    });
}
//# sourceMappingURL=category.controller.js.map