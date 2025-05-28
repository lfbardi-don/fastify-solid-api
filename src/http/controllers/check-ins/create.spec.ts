import request from 'supertest';
import { app } from '@/app';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create Check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });


    it('should be able to create a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const gym = await prisma.gym.create({
            data: {
                title: 'Gym 01',
                description: 'Description 01',
                phone: '123456789',
                latitude: -23.55052,
                longitude: -46.63332,
            },
        });

        const checkInResponse = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: gym.latitude.toString(),
                longitude: gym.longitude.toString(),
            });

        expect(checkInResponse.statusCode).toBe(201);
    });
});

