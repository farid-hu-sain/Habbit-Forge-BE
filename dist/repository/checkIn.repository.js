export class CheckInRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.checkIn.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                habit: true,
                user: true
            }
        });
    }
    async findById(id) {
        return await this.prisma.checkIn.findUnique({
            where: {
                id
            },
            include: {
                habit: true,
                user: true
            }
        });
    }
    async create(data) {
        return await this.prisma.checkIn.create({ data });
    }
    async update(id, data) {
        return await this.prisma.checkIn.update({
            where: {
                id,
            },
            data
        });
    }
    async softDelete(id) {
        return await this.prisma.checkIn.update({
            where: {
                id,
            },
            data: {}
        });
    }
}
//# sourceMappingURL=checkIn.repository.js.map