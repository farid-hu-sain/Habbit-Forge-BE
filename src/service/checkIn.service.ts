import type { CheckIn } from "@prisma/client";
import type { ICheckInRepository } from "../repository/checkIn.repository.js";
import prisma from "../database.js";

export interface ICheckInService {
  getCheckInById(id: string, userId: string): Promise<CheckIn>;
  createCheckIn(data: {
    note?: string;
    habitId: string;
    userId: string;
  }): Promise<CheckIn>;
  updateCheckIn(id: string, data: Partial<CheckIn>, userId: string): Promise<CheckIn>;
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validasi: Habit harus milik user DAN aktif
    const habit = await prisma.habit.findFirst({
      where: {
        id: data.habitId,
        userId: data.userId,
        isActive: true
      }
    });

    if (!habit) {
      throw new Error("Habit tidak ditemukan atau tidak aktif");
    }

    const existingCheckIn = await this.checkInRepo.findTodayCheckIn(
      data.habitId,
      today
    );
    
    if (existingCheckIn) {
      throw new Error("Sudah check-in hari ini");
    }

    const input: any = {
      date: today,
      note: data.note,
      habit: { connect: { id: data.habitId } },
      user: { connect: { id: data.userId } },
    };

    return await this.checkInRepo.create(input);
  }

  async updateCheckIn(id: string, data: Partial<CheckIn>, userId: string): Promise<CheckIn> {
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