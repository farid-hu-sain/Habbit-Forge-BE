import type { Prisma, PrismaClient, CheckIn } from "@prisma/client";

export interface ICheckInRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.CheckInWhereInput,
    orderBy: Prisma.CheckInOrderByWithRelationInput
  ): Promise<CheckIn[]>;
  findById(id: string): Promise<CheckIn | null>;
  create(data: Prisma.CheckInCreateInput): Promise<CheckIn>;
  findTodayCheckIn(habitId: string, date: Date): Promise<CheckIn | null>;
  update(id: string, data: Prisma.CheckInUpdateInput): Promise<CheckIn>;
  softDelete(id: string): Promise<CheckIn>;
}

export class CheckInRepository implements ICheckInRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.CheckInWhereInput,
    orderBy: Prisma.CheckInOrderByWithRelationInput
  ): Promise<CheckIn[]> {
    return await this.prisma.checkIn.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        habit: true,
        user: true,
      },
    });
  }

  async findById(id: string): Promise<CheckIn | null> {
    return await this.prisma.checkIn.findUnique({
      where: {
        id,
      },
      include: {
        habit: true,
        user: true,
      },
    });
  }

  async findTodayCheckIn(habitId: string, date: Date): Promise<CheckIn | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.prisma.checkIn.findFirst({
      where: {
        habitId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async create(data: Prisma.CheckInCreateInput): Promise<CheckIn> {
    return await this.prisma.checkIn.create({ data });
  }

  async update(id: string, data: Prisma.CheckInUpdateInput): Promise<CheckIn> {
    return await this.prisma.checkIn.update({
      where: {
        id,
      },
      data,
    });
  }

  async softDelete(id: string): Promise<CheckIn> {
    return await this.prisma.checkIn.update({
      where: {
        id,
      },
      data: {},
    });
  }
}
