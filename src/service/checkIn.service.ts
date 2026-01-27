import { CheckIn, Prisma } from "@prisma/client";
import type { ICheckInRepository } from "../repository/checkIn.repository.js";
import prisma from "../database.js";
import {
  parseDateFromFE,
  formatDateForFE,
  getTodayDateString,
  isValidDateString,
} from "../utils/timeUtils.js";

export interface CheckInResponse {
  id: string;
  habitId: string;
  userId: string;
  date: string; // String YYYY-MM-DD untuk FE
  note: string | null;
  createdAt: Date;
  habit?: any;
  user?: any;
}

export interface ICheckInService {
  getCheckInById(id: string, userId: string): Promise<CheckInResponse>;
  createCheckIn(data: {
    note?: string;
    habitId: string;
    userId: string;
    date?: string;
  }): Promise<CheckInResponse>;
  updateCheckIn(
    id: string,
    data: { note?: string },
    userId: string,
  ): Promise<CheckInResponse>;
  deleteCheckIn(id: string, userId: string): Promise<CheckInResponse>;
}

export class CheckInService implements ICheckInService {
  constructor(private checkInRepo: ICheckInRepository) {}

  async getCheckInById(id: string, userId: string): Promise<CheckInResponse> {
    const checkIn = await this.checkInRepo.findById(id);

    if (!checkIn) {
      throw new Error("CheckIn tidak ditemukan");
    }

    if (checkIn.userId !== userId) {
      throw new Error("Akses ditolak");
    }

    return this.formatCheckInResponse(checkIn);
  }

  async createCheckIn(data: {
    note?: string;
    habitId: string;
    userId: string;
    date?: string;
  }): Promise<CheckInResponse> {
    const checkInDateStr =
      data.date && isValidDateString(data.date)
        ? data.date
        : getTodayDateString(); // 🆕 UTC date string

    const checkInDate = parseDateFromFE(checkInDateStr); // 🆕 UTC Date

    // Validasi habit exists, active, dan milik user
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

    // Validasi habit start date (UTC comparison)
    if (checkInDate < habit.startDate) {
      const habitStartStr = formatDateForFE(habit.startDate);
      throw new Error(`Tidak bisa check-in sebelum ${habitStartStr}`);
    }

    try {
      // Database constraint akan handle race condition & duplikasi
      const input: Prisma.CheckInCreateInput = {
        date: checkInDate,
        habit: { connect: { id: data.habitId } },
        user: { connect: { id: data.userId } },
      };

      if (data.note !== undefined) {
        input.note = data.note;
      }

      const checkIn = await this.checkInRepo.create(input);
      return this.formatCheckInResponse(checkIn);
    } catch (error) {
      // Tangkap Prisma constraint violation error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error(`Sudah check-in pada tanggal ${checkInDateStr}`);
        }
      }

      throw error;
    }
  }

  async updateCheckIn(
    id: string,
    data: { note?: string },
    userId: string,
  ): Promise<CheckInResponse> {
    await this.getCheckInById(id, userId);

    const updateData: Prisma.CheckInUpdateInput = {};

    if (data.note !== undefined) {
      updateData.note = data.note;
    }

    const updated = await this.checkInRepo.update(id, updateData);
    return this.formatCheckInResponse(updated);
  }

  async deleteCheckIn(id: string, userId: string): Promise<CheckInResponse> {
    await this.getCheckInById(id, userId);

    const deleted = await this.checkInRepo.delete(id);
    return this.formatCheckInResponse(deleted);
  }

  private formatCheckInResponse(checkIn: CheckIn): CheckInResponse {
    const response: CheckInResponse = {
      id: checkIn.id,
      habitId: checkIn.habitId,
      userId: checkIn.userId,
      date: formatDateForFE(checkIn.date), // 🆕 UTC to string
      note: checkIn.note,
      createdAt: checkIn.createdAt,
    };

    // Include relations jika ada
    const checkInWithRelations = checkIn as any;

    if (checkInWithRelations.habit) {
      response.habit = checkInWithRelations.habit;
    }

    if (checkInWithRelations.user) {
      response.user = checkInWithRelations.user;
    }

    return response;
  }
}
