import request from 'supertest';
import { app } from '@/app';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });


    it('should be able to search gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Green',
                description: 'Description 01',
                phone: '123456789',
                latitude: -23.55052,
                longitude: -46.63332,
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Red',
                description: 'Description 02',
                phone: '123456789',
                latitude: -23.55052,
                longitude: -46.63332,
            });

        const gymResponse = await request(app.server)
            .get('/gyms/search')
            .query({ q: 'Green' })
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(gymResponse.statusCode).toBe(200);

        expect(gymResponse.body.gyms).toHaveLength(1);
        expect(gymResponse.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Gym Green',
            }),
        ]);
    });
});

