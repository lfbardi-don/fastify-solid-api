import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { create } from "./create";
import { nearby } from "./nearby";
import { search } from "./search";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT);

    app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create);

    app.get('/gyms/nearby', nearby);
    app.get('/gyms/search', search);
}