import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine((value) => value >= -90 && value <= 90),
        longitude: z.number().refine((value) => value >= -180 && value <= 180),
    });

    const { title, description, phone, latitude, longitude } = createBodySchema.parse(request.body);

    const createGymUseCase = makeCreateGymUseCase();

    await createGymUseCase.execute({ title, description, phone, latitude, longitude });

    return reply.status(201).send();
}