import { prisma } from "@/lib/prisma";
import type { Prisma, CheckIn } from "generated/prisma";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const startOfToday = dayjs(date).startOf('date');
        const endOfToday = dayjs(date).endOf('date');

        return prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfToday.toDate(),
                    lte: endOfToday.toDate(),
                },
            },
        }) || null;
    }
    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = await prisma.checkIn.create({
            data,
        });
        return checkIn;
    }

    async findById(id: string): Promise<CheckIn | null> {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id,
            },
        });
        return checkIn;
    }

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId,
            },
            take: 20,
            skip: (page - 1) * 20,
        });
        return checkIns;
    }

    async countByUserId(userId: string): Promise<number> {
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId,
            },
        });
        return count;
    }

    async save(checkIn: CheckIn): Promise<CheckIn> {
        const updatedCheckIn = await prisma.checkIn.update({
            where: {
                id: checkIn.id,
            },
            data: checkIn,
        });
        return updatedCheckIn;
    }
}