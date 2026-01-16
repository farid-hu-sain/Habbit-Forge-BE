import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import config from "./utils/env.js";
import { PrismaClient } from "@prisma/client";
let prisma;
const getPrisma = () => {
    if (!prisma) {
        const connectionString = config.DATABASE_URL;
        const pool = new Pool({
            connectionString: connectionString + (connectionString.includes('railway.app')
                ? '?sslmode=no-verify'
                : ''),
            ...(connectionString.includes('railway') && {
                ssl: { rejectUnauthorized: false }
            })
        });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
};
const prismaInstance = getPrisma();
export default prismaInstance;
//# sourceMappingURL=database.js.map