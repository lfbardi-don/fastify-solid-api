import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserMetricsUseCase } from './get-user-metrics';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let sut: GetUserMetricsUseCase;
let checkInsRepository: InMemoryCheckInsRepository;

describe('Get user metrics use case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new GetUserMetricsUseCase(checkInsRepository);
    });

    it('should be able to get user metrics', async () => {
        await checkInsRepository.create({
            gym_id: 'gym-1',
            user_id: 'user-1',
        });

        await checkInsRepository.create({
            gym_id: 'gym-2',
            user_id: 'user-1',
        });

        const { checkInsCount } = await sut.execute({
            userId: 'user-1',
        });

        expect(checkInsCount).toEqual(2);
    });
});
