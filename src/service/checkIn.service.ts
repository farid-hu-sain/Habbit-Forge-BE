import type { CheckIn } from "@prisma/client";
import type { ICheckInRepository } from "../repository/checkIn.repository.js";
import prisma from "../database.js";
import { getTodayRange } from "../utils/timeUtils.js";

export interface ICheckInService {
  getCheckInById(id: string, userId: string): Promise<CheckIn>;
  createCheckIn(data: {
    note?: string;
    habitId: string;
    userId: string;
  }): Promise<CheckIn>;
  updateCheckIn(
    id: string,
    data: Partial<CheckIn>,
    userId: string,
  ): Promise<CheckIn>;
  deleteCheckIn(id: string, userId: string): Promise<CheckIn>;
}

export class CheckInService implements ICheckInService {
  constructor(private checkInRepo: ICheckInRepository) {}

  async getCheckInById(id: string, userId: string): Promise<CheckIn> {
    const checkIn = await this.checkInRepo.findById(id);

    if (!checkIn) {
      throw new Error("CheckIn tidak ditemukan");
    }

    // Auto-validate ownership
    if (checkIn.userId !== userId) {
      throw new Error("CheckIn tidak ditemukan");
    }

    return checkIn;
  }

  async createCheckIn(data: {
    note?: string;
    habitId: string;
    userId: string;
  }): Promise<CheckIn> {
    const { start, end } = getTodayRange();

    // Validasi: Habit harus milik user DAN aktif
    const habit = await prisma.habit.findFirst({
      where: {
        id: data.habitId,
        userId: data.userId,
        isActive: true,
      },
    });

    if (!habit) {
      throw new Error("Habit tidak ditemukan atau tidak aktif");
    }

    // Cek apakah sudah check-in hari ini
    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        habitId: data.habitId,
        userId: data.userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    if (existingCheckIn) {
      throw new Error("Sudah check-in hari ini");
    }

    // Buat check-in
    const input: any = {
      date: new Date(), // Waktu sekarang (WIB)
      note: data.note,
      habit: { connect: { id: data.habitId } },
      user: { connect: { id: data.userId } },
    };

    return await this.checkInRepo.create(input);
  }

  async updateCheckIn(
    id: string,
    data: Partial<CheckIn>,
    userId: string,
  ): Promise<CheckIn> {
    // Validasi ownership
    await this.getCheckInById(id, userId);

    return await this.checkInRepo.update(id, data);
  }

  async deleteCheckIn(id: string, userId: string): Promise<CheckIn> {
    // Validasi ownership
    await this.getCheckInById(id, userId);

    return await this.checkInRepo.softDelete(id);
  }
}
