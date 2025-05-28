import { describe, it, expect, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create gym use case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsRepository);
    });

    it('should be able to create a gym', async () => {

        const { gym } = await sut.execute({
            title: 'Gym 01',
            description: 'Description',
            phone: '123456',
            latitude: 40.2202714,
            longitude: -7.3335084,
        });

        expect(gym.id).toEqual(expect.any(String));
    });
});
