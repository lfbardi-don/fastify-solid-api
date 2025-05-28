import { describe, it, expect, beforeEach } from 'vitest';
import { SearchGymsUseCase } from './search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Prisma } from '@/lib/prisma';

let sut: SearchGymsUseCase;
let gymsRepository: InMemoryGymsRepository;

describe('Search gyms use case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it('should be able to search gyms', async () => {
        await gymsRepository.create({
            title: 'Gym Green',
            description: null,
            phone: null,
            latitude: new Prisma.Decimal(40.2202714),
            longitude: new Prisma.Decimal(-7.3335084),
        });

        await gymsRepository.create({
            title: 'Gym Red',
            description: null,
            phone: null,
            latitude: new Prisma.Decimal(40.2202714),
            longitude: new Prisma.Decimal(-7.3335084),
        });

        const { gyms } = await sut.execute({
            query: 'Green',
            page: 1,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Gym Green' }),
        ]);
    });

    it('should be able to search gyms with pagination', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Gym ${i}`,
                description: null,
                phone: null,
                latitude: new Prisma.Decimal(40.2202714),
                longitude: new Prisma.Decimal(-7.3335084),
            });
        }

        const { gyms } = await sut.execute({
            query: 'Gym',
            page: 2,
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Gym 21' }),
            expect.objectContaining({ title: 'Gym 22' }),
        ]);
    });
});
