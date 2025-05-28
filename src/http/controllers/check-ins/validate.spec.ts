import request from 'supertest';
import { app } from '@/app';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Validate Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });


    it('should be able to validate check-in', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: 'john.doe@example.com',
            },
        });

        const gym = await prisma.gym.create({
            data: {
                title: 'Gym 01',
                latitude: -23.55052,
                longitude: -46.63332,
            },
        });

        const checkIn = await prisma.checkIn.create({
            data: {
                gym_id: gym.id,
                user_id: user.id,
            },
        });

        const checkInResponse = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(checkInResponse.statusCode).toBe(204);

        const checkInUpdated = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkIn.id,
            },
        });

        expect(checkInUpdated.validated_at).toEqual(expect.any(Date));
    });
});

