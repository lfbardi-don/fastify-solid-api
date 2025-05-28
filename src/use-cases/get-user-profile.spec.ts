import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserProfileUseCase } from './get-user-profile';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let sut: GetUserProfileUseCase;
let userRepository: InMemoryUsersRepository;

describe('Get user profile use case', () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(userRepository);
    });

    it('should be able to get user profile', async () => {

        const createdUser = await userRepository.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.execute({
            userId: createdUser.id,
        });

        expect(user).toEqual(createdUser);
    });

    it('should not be able to get user profile of a non existing user', async () => {
        await expect(() => {
            return sut.execute({
                userId: 'non-existing-user-id',
            });
        }).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
