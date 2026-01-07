import type { CheckIn} from "../generated";
import type { ICheckInRepository } from "../repository/checkIn.repository"


export interface CheckInListRespone{
    checkIn:CheckIn[], 
    total: number, 
    totalPages: number, 
    currentPage: number 
}
export interface ICheckInService {
  getCheckInById (id: string): Promise<CheckIn | null>;
  createCheckIn(data: {note?: string, habitId: string, userId: string} ): Promise<CheckIn> 
  updateCheckIn(id: string, data: Partial<CheckIn>) : Promise <CheckIn>
  deleteCheckIn(id: string) : Promise<CheckIn>
 
}

export class CheckInService implements ICheckInService { 
    constructor (private checkInRepo: ICheckInRepository) {}

  async getCheckInById (id: string): Promise<CheckIn | null>{  

const checkIn = await this.checkInRepo.findById(id)
    if (!checkIn) {
     throw new Error ('CheckIn tidak ditemukan')
    }

return checkIn
}


    async createCheckIn(data: {note?: string, habitId: string, userId: string}): Promise<CheckIn> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const input = {
        date: today,
        note: data.note,
        habit: { connect: { id: data.habitId } },
        user: { connect: { id: data.userId } }
    } as any 
    
    return await this.checkInRepo.create(input);
}


    async updateCheckIn  (id: string, data : Partial<CheckIn>) : Promise<CheckIn>  {
  await this.getCheckInById(id)

  return await this.checkInRepo.update(id, data)
}

    async deleteCheckIn  (id: string)  {

    return await this.checkInRepo.softDelete(id)
}

}


