import { prisma } from "@/lib/prisma";
import type { Prisma, User } from "generated/prisma";
import type { UsersRepository } from "@/repositories/users-repository";

export class PrismaUsersRepository implements UsersRepository {
    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = await prisma.user.create({
            data,
        });
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        return user;
    }
}