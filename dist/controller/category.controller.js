import { successResponse } from "../utils/response.js";
export class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
        this.getAllCategoryHandler = this.getAllCategoryHandler.bind(this);
        this.getCategoryByIdHandler = this.getCategoryByIdHandler.bind(this);
    }
    async getAllCategoryHandler(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder || "desc";
        const result = await this.categoryService.getAll({
            page,
            limit,
            search,
            sortBy,
            sortOrder
        });
        const pagination = {
            page: result.currentPage,
            limit,
            total: result.total,
            totalPages: result.totalPages
        };
        successResponse(res, "buku berhasil ditambahkan", result.category, pagination);
    }
    async getCategoryByIdHandler(req, res) {
        if (!req.params.id) {
            throw new Error("tidak ada param");
        }
        const category = await this.categoryService.getCategoryById(req.params.id);
        successResponse(res, "kategori sudah ditemukan", category);
    }
}
//# sourceMappingURL=category.controller.js.map
