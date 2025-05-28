import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createParamsSchema = z.object({
        gymId: z.string().uuid(),
    });

    const createBodySchema = z.object({
        latitude: z.coerce.number().refine((value) => value >= -90 && value <= 90),
        longitude: z.coerce.number().refine((value) => value >= -180 && value <= 180),
    });

    const { gymId } = createParamsSchema.parse(request.params);
    const { latitude, longitude } = createBodySchema.parse(request.body);

    const checkInUseCase = makeCheckInUseCase();

    await checkInUseCase.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude,
    });

    return reply.status(201).send();
}