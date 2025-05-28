import { Gym, Prisma } from "@/lib/prisma"
import { FindManyNearbyParams, GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { randomUUID } from "crypto";

export class InMemoryGymsRepository implements GymsRepository {

    gyms: Gym[] = [];

    async findById(id: string) {
        return this.gyms.find(gym => gym.id === id) || null;
    }

    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym = {
            id: data.id || randomUUID(),
            title: data.title,
            description: data.description || null,
            phone: data.phone || null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date(),
        };
        this.gyms.push(gym);
        return gym;
    }

    async searchMany(query: string, page: number): Promise<Gym[]> {
        const LIMIT = 20;
        const OFFSET = (page - 1) * LIMIT;
        return this.gyms.filter(gym => gym.title.includes(query)).slice(OFFSET, OFFSET + LIMIT);
    }

    async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
        const MAX_DISTANCE_IN_KM = 10;

        return this.gyms.filter(gym => {
            const distanceInKm = getDistanceBetweenCoordinates(
                { latitude: params.latitude, longitude: params.longitude },
                { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
            );
            return distanceInKm < MAX_DISTANCE_IN_KM;
        });
    }

}