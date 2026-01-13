import type { CheckIn } from "../../dist/generated/index.js";
import type { ICheckInRepository } from "../repository/checkIn.repository.js";
export interface CheckInListRespone {
    checkIn: CheckIn[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface ICheckInService {
    getCheckInById(id: string): Promise<CheckIn | null>;
    createCheckIn(data: {
        note?: string;
        habitId: string;
        userId: string;
    }): Promise<CheckIn>;
    updateCheckIn(id: string, data: Partial<CheckIn>): Promise<CheckIn>;
    deleteCheckIn(id: string): Promise<CheckIn>;
}
export declare class CheckInService implements ICheckInService {
    private checkInRepo;
    constructor(checkInRepo: ICheckInRepository);
    getCheckInById(id: string): Promise<CheckIn | null>;
    createCheckIn(data: {
        note?: string;
        habitId: string;
        userId: string;
    }): Promise<CheckIn>;
    updateCheckIn(id: string, data: Partial<CheckIn>): Promise<CheckIn>;
    deleteCheckIn(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        habitId: string;
        date: Date;
        note: string | null;
    }>;
}
//# sourceMappingURL=checkIn.service.d.ts.map
