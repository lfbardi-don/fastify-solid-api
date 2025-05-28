import request from 'supertest';
import { app } from '@/app';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });


    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const gymResponse = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym 01',
                description: 'Description 01',
                phone: '123456789',
                latitude: -23.55052,
                longitude: -46.63332,
            });

        expect(gymResponse.statusCode).toBe(201);
    });
});

