import type { CheckIn } from "../../dist/generated";
import type { ICheckInRepository } from "../repository/checkIn.repository";
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
export declare class CheckInService implements ICheckInService {
    private checkInRepo;
    constructor(checkInRepo: ICheckInRepository);
    getCheckInById(id: string, userId: string): Promise<CheckIn>;
    createCheckIn(data: {
        note?: string;
        habitId: string;
        userId: string;
    }): Promise<CheckIn>;
    updateCheckIn(id: string, data: Partial<CheckIn>, userId: string): Promise<CheckIn>;
    deleteCheckIn(id: string, userId: string): Promise<CheckIn>;
}
//# sourceMappingURL=checkIn.service.d.ts.map