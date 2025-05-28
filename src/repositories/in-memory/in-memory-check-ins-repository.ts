import { CheckIn, Prisma } from "generated/prisma";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {

    checkIns: CheckIn[] = [];

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            created_at: new Date(),
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
        };

        this.checkIns.push(checkIn);

        return checkIn;
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const startOfToday = dayjs(date).startOf('date');
        const endOfToday = dayjs(date).endOf('date');

        return this.checkIns.find(
            (checkIn) =>
                checkIn.user_id === userId &&
                dayjs(checkIn.created_at).isAfter(startOfToday) &&
                dayjs(checkIn.created_at).isBefore(endOfToday)
        ) || null;
    }

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        const LIMIT = 20;
        const OFFSET = (page - 1) * LIMIT;
        return this.checkIns.filter((checkIn) => checkIn.user_id === userId).slice(OFFSET, OFFSET + LIMIT);
    }

    async countByUserId(userId: string): Promise<number> {
        return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length;
    }

    async findById(id: string): Promise<CheckIn | null> {
        return this.checkIns.find((checkIn) => checkIn.id === id) || null;
    }

    async save(checkIn: CheckIn): Promise<CheckIn> {
        const checkInIndex = this.checkIns.findIndex((check_in) => check_in.id === checkIn.id);

        if (checkInIndex >= 0) {
            this.checkIns[checkInIndex] = checkIn;
        }

        return checkIn;
    }
}