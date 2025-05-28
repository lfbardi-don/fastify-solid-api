import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let registerUseCase: RegisterUseCase;

describe('Register use case', () => {
    beforeEach(() => {
        registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());
    });

    it('should hash user password upon registration', async () => {

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456',
        });

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it('should not be able to register with same email twice', async () => {
        const email = 'john.doe@example.com';

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456',
        });

        await expect(() => {
            return registerUseCase.execute({
                name: 'John Doe',
                email,
                password: '123456',
            });
        }).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

    it('should be able to register', async () => {
        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    });
});
