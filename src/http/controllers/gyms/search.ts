import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchQuerySchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1),
    });

    const { q, page } = searchQuerySchema.parse(request.query);

    const searchGymsUseCase = makeSearchGymsUseCase();

    const { gyms } = await searchGymsUseCase.execute({ query: q, page });

    return reply.status(200).send({ gyms });
}