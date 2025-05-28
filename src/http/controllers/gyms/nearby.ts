import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const searchQuerySchema = z.object({
        latitude: z.coerce.number().refine((value) => value >= -90 && value <= 90),
        longitude: z.coerce.number().refine((value) => value >= -180 && value <= 180),
    });

    const { latitude, longitude } = searchQuerySchema.parse(request.query);

    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

    const { gyms } = await fetchNearbyGymsUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
    });

    return reply.status(200).send({ gyms });
}