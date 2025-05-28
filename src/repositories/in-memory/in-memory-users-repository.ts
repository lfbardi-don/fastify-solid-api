import type { User, Prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
    users: User[] = [];

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            role: data.role ?? 'MEMBER',
            created_at: new Date(),
        };

        this.users.push(user);

        return user;
    }
    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email === email) || null;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) || null;
    }
}