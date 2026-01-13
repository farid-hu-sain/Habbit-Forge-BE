import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import config from "./utils/env.js";
import { PrismaClient } from "../dist/generated/index.js";
let prisma;
const getPrisma = () => {
    if (!prisma) {
        const pool = new Pool({ connectionString: config.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
};
const prismaIntance = getPrisma();
export default prismaIntance;
//# sourceMappingURL=database.js.map
