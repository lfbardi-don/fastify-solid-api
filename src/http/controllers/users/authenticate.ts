import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const authenticateUseCase = makeAuthenticateUseCase();

        const { user } = await authenticateUseCase.execute({ email, password });

        const token = await reply.jwtSign({ role: user.role }, {
            sign: { sub: user.id },
        });

        const refreshToken = await reply.jwtSign({ role: user.role }, {
            sign: { sub: user.id, expiresIn: '7d' },
        });

        return reply
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: true,
                maxAge: 60 * 60 * 24 * 7,
            })
            .status(200).send({
                token,
            });
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: error.message });
        }

        throw error;
    }
}