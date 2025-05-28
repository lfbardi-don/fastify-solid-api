import { describe, it, expect, beforeEach } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Prisma } from '@/lib/prisma';

let sut: FetchNearbyGymsUseCase;
let gymsRepository: InMemoryGymsRepository;

describe('Fetch nearby gyms use case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Far gym',
            description: null,
            phone: null,
            latitude: new Prisma.Decimal(40.2202714),
            longitude: new Prisma.Decimal(-7.3335084),
        });

        await gymsRepository.create({
            title: 'Near gym',
            description: null,
            phone: null,
            latitude: new Prisma.Decimal(41.1942606),
            longitude: new Prisma.Decimal(-8.6683402),
        });

        const { gyms } = await sut.execute({
            userLatitude: 41.1530454,
            userLongitude: -8.6242229,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near gym' }),
        ]);
    });
});
