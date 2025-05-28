import { env } from "@/env";
import { PrismaClient } from "generated/prisma/client";
export * from '../../generated/prisma/client';

const prisma = new PrismaClient({
    log: env.NODE_ENV === 'dev' ? ['query'] : [],
});

export { prisma };