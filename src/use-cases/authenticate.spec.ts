import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let sut: AuthenticateUseCase;
let userRepository: InMemoryUsersRepository;

describe('Authenticate use case', () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(userRepository);
    });

    it('should be able to authenticate an existing user', async () => {

        await userRepository.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.execute({
            email: 'john.doe@example.com',
            password: '123456',
        });

        expect(user).toEqual(expect.any(Object));
    });

    it('should not be able to authenticate a non existing user', async () => {
        await expect(() => {
            return sut.execute({
                email: 'john.doe@example.com',
                password: '123456',
            });
        }).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await userRepository.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: await hash('123456', 6),
        });

        await expect(() => {
            return sut.execute({
                email: 'john.doe@example.com',
                password: '12345678',
            });
        }).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
