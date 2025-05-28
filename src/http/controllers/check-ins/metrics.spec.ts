import request from 'supertest';
import { app } from '@/app';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Metrics Check-ins (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });


    it('should be able to list metrics check-ins', async () => {
        const { token } = await createAndAuthenticateUser(app);

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

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id,
                },
                {
                    gym_id: gym.id,
                    user_id: user.id,
                },
            ],
        });

        const metricsResponse = await request(app.server)
            .get('/check-ins/metrics')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(metricsResponse.statusCode).toBe(200);
        expect(metricsResponse.body.checkInsCount).toEqual(2);
    });
});

