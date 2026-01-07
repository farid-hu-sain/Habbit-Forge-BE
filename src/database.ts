import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import config from './utils/env'
import { PrismaClient } from "./generated";  

let prisma: PrismaClient

const getPrisma = () => {
    if (!prisma) {
        const pool = new Pool({ connectionString: config.DATABASE_URL })
        const adapter = new PrismaPg(pool)
        prisma = new PrismaClient({ adapter })
    }
    return prisma
}

const prismaIntance = getPrisma()
export default prismaIntance