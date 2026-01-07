import type { Prisma, Habit} from "../generated";
import type { IHabitRepository } from "../repository/habit.repository"

interface FindAllParams {
  page: number
  limit: number
  search?: {
    title?: string,
  }
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface HabitListRespone{
    habit:Habit[], 
    total: number, 
    totalPages: number, 
    currentPage: number 
}
export interface IHabitService {
  getAll(params: FindAllParams) : Promise <HabitListRespone>
  getHabitById (id: string): Promise<Habit | null>;
  createHabit(data: {title: string, description: string, isActive:boolean, userId: string} ): Promise<Habit> 
  updateHabit(id: string, data: Partial<Habit>) : Promise <Habit>
  deleteHabit(id: string) : Promise<Habit>
  toggleHabit(id: string): Promise<Habit>;
}

export class HabitService implements IHabitService { 
    constructor (private habitRepo: IHabitRepository) {}

       async getAll (params: FindAllParams) : Promise<HabitListRespone>  {
    const { page, limit, search, sortBy, sortOrder} = params

    const skip = (page - 1 ) * limit
    
    const whereClause : Prisma.HabitWhereInput = {}

    if (search?.title){whereClause.title = { contains: search.title, mode: "insensitive"}}

    const sortCriteria :  Prisma.HabitOrderByWithRelationInput = sortBy ? { [sortBy] : sortOrder || "desc" } : {createdAt: "desc"}

    const habit = await this.habitRepo.list(skip, limit, whereClause, sortCriteria)
    
    const total = await this.habitRepo.countAll(whereClause)


    return { 
      habit,
      total, 
      totalPages: Math.ceil( total/limit), 
      currentPage: page }
}


  async getHabitById (id: string): Promise<Habit | null>{  

    const habit = await this.habitRepo.findById(id)
            if (!habit) {
                throw new Error ('Habit tidak ditemukan')
            }   

        return habit
    }


    async createHabit(
    data: {
        title: string, 
        description: string, 
        isActive: boolean,
        userId: string  
    }
    ): Promise<Habit> {
        return await this.habitRepo.create({
            ...data,
            user: {
                connect: { id:data.userId}
        }});
    }


        async updateHabit  (id: string, data : Partial<Habit>) : Promise<Habit>  {
      await this.getHabitById(id)


        return await this.habitRepo.update(id, data)
    }

    async deleteHabit  (id: string)  {

    return await this.habitRepo.softDelete(id)
    }

    

    async toggleHabit(id: string): Promise<Habit> {
        return await this.habitRepo.toggleActive(id);
    }
}
