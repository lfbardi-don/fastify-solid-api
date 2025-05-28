import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ValidateCheckInUseCase } from './validate-check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let sut: ValidateCheckInUseCase;
let checkInsRepository: InMemoryCheckInsRepository;

describe('Validate check-in use case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInUseCase(checkInsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to validate check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-1',
            user_id: 'user-1',
        });

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.checkIns[0].validated_at).toEqual(expect.any(Date));
    });

    it('should not be able to validate check-in that does not exist', async () => {
        await expect(() => sut.execute({
            checkInId: 'non-existing-check-in-id',
        })).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not be able to validate check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2025, 4, 20, 12, 0));

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-1',
            user_id: 'user-1',
        });

        const tweentyOneMinutesInMs = 1000 * 60 * 21;

        vi.advanceTimersByTime(tweentyOneMinutesInMs);

        await expect(() => sut.execute({
            checkInId: createdCheckIn.id,
        })).rejects.toBeInstanceOf(Error);
    });
});
