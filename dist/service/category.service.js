export class CategoryService {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async getAll(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (search?.name) {
            whereClause.name = { contains: search.name, mode: "insensitive" };
        }
        const sortCriteria = sortBy ? { [sortBy]: sortOrder || "desc" } : { createdAt: "desc" };
        const category = await this.categoryRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.categoryRepo.countAll(whereClause);
        return {
            category,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
    async getCategoryById(id) {
        const category = await this.categoryRepo.findById(id);
        if (!category) {
            throw new Error('Category tidak ditemukan');
        }
        return category;
    }
}
//# sourceMappingURL=category.service.js.map