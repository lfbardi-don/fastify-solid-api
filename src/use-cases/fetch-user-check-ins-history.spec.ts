import { describe, it, expect, beforeEach, vi, afterEach, } from 'vitest';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let sut: FetchUserCheckInsHistoryUseCase;
let checkInsRepository: InMemoryCheckInsRepository;

describe('Fetch user check-ins history use case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
    });

    it('should be able to fetch user check-ins history', async () => {
        await checkInsRepository.create({
            gym_id: 'gym-1',
            user_id: 'user-1',
        });

        await checkInsRepository.create({
            gym_id: 'gym-2',
            user_id: 'user-1',
        });

        await sut.execute({
            userId: 'user-1',
            page: 1,
        });

        expect(checkInsRepository.checkIns).toHaveLength(2);
        expect(checkInsRepository.checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-1' }),
            expect.objectContaining({ gym_id: 'gym-2' }),
        ]);
    });

    it('should be able to fetch user check-ins history with pagination', async () => {
        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-1',
            });
        }

        const { checkIns } = await sut.execute({
            userId: 'user-1',
            page: 2,
        });

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' }),
        ]);
    });
});
