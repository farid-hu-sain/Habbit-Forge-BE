export class CategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.category.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                habit: true
            }
        });
    }
    async countAll(where) {
        return await this.prisma.category.count({ where });
    }
    async findById(id) {
        return await this.prisma.category.findUnique({
            where: {
                id
            },
            include: {
                habit: true,
            }
        });
    }
}
//# sourceMappingURL=category.repository.js.map