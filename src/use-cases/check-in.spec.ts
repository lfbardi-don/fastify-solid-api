import { describe, it, expect, beforeEach, vi, afterEach, } from 'vitest';
import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Prisma } from '@/lib/prisma';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let sut: CheckInUseCase;
let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;

describe('Check-in use case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);

        await gymsRepository.create({
            id: 'gym-1',
            title: 'Gym 1',
            description: null,
            phone: null,
            latitude: 41.1575607,
            longitude: -8.6288952,
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            userId: 'user-1',
            gymId: 'gym-1',
            userLatitude: 41.1575607,
            userLongitude: -8.6288952,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2025, 4, 20, 12, 0, 0));
        await sut.execute({
            userId: 'user-1',
            gymId: 'gym-1',
            userLatitude: 41.1575607,
            userLongitude: -8.6288952,
        });

        await expect(() =>
            sut.execute({
                userId: 'user-1',
                gymId: 'gym-1',
                userLatitude: 41.1575607,
                userLongitude: -8.6288952,
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
    });

    it('should be able to check in on different days', async () => {
        vi.setSystemTime(new Date(2025, 4, 20, 12, 0, 0));
        await sut.execute({
            userId: 'user-1',
            gymId: 'gym-1',
            userLatitude: 41.1575607,
            userLongitude: -8.6288952,
        });

        vi.setSystemTime(new Date(2025, 4, 21, 12, 0, 0));
        const { checkIn } = await sut.execute({
            userId: 'user-1',
            gymId: 'gym-1',
            userLatitude: 41.1575607,
            userLongitude: -8.6288952,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in on a gym too far', async () => {
        await gymsRepository.create({
            id: 'gym-2',
            title: 'Gym 2',
            description: null,
            phone: null,
            latitude: new Prisma.Decimal(41.1575607),
            longitude: new Prisma.Decimal(-8.6288952),
        });



        await expect(() =>
            sut.execute({
                userId: 'user-1',
                gymId: 'gym-2',
                userLatitude: 40.2202714,
                userLongitude: -7.3335084,
            })
        ).rejects.toBeInstanceOf(MaxDistanceError);
    });
});
