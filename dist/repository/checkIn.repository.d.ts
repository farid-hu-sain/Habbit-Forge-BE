import type { Prisma, PrismaClient, CheckIn } from "../../dist/generated";
export interface ICheckInRepository {
    list(skip: number, take: number, where: Prisma.CheckInWhereInput, orderBy: Prisma.CheckInOrderByWithRelationInput): Promise<CheckIn[]>;
    findById(id: string): Promise<CheckIn | null>;
    create(data: Prisma.CheckInCreateInput): Promise<CheckIn>;
    findTodayCheckIn(habitId: string, date: Date): Promise<CheckIn | null>;
    update(id: string, data: Prisma.CheckInUpdateInput): Promise<CheckIn>;
    softDelete(id: string): Promise<CheckIn>;
}
export declare class CheckInRepository implements ICheckInRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.CheckInWhereInput, orderBy: Prisma.CheckInOrderByWithRelationInput): Promise<CheckIn[]>;
    findById(id: string): Promise<CheckIn | null>;
    findTodayCheckIn(habitId: string, date: Date): Promise<CheckIn | null>;
    create(data: Prisma.CheckInCreateInput): Promise<CheckIn>;
    update(id: string, data: Prisma.CheckInUpdateInput): Promise<CheckIn>;
    softDelete(id: string): Promise<CheckIn>;
}
//# sourceMappingURL=checkIn.repository.d.ts.map