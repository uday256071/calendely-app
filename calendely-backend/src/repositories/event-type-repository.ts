import { prisma } from "../config/database.js";
import { CreateEventTypeDto, UpdateEventTypeDto } from "../dtos/event-type.dto.js";

export async function findByHostId(hostId: number){
    const eventTypes = prisma.eventType.findMany({
        where: {
            hostId: hostId,
        },
        orderBy: [
            { createdAt: 'desc' },
        ],
    });
    return eventTypes;
}

export async function findById(id: number){
    const eventType = prisma.eventType.findUnique({
        where: {
            id: id,
        },
    });
    return eventType;
}

export async function create(hostId: number, data: CreateEventTypeDto){
    const eventType = prisma.eventType.create({
        data: {
            hostId,
            ...data,
        },
    });
    return eventType;
}

export async function update(id: number, data: UpdateEventTypeDto){
    const eventType = prisma.eventType.update({
        where: {
            id: id,
        },
        data,
    });
    return eventType;
}

export async function remove(id: number){
    const eventType = prisma.eventType.delete({
        where: {
            id: id,
        },
    });
    return eventType;
}

export async function findByHostAndSlug(hostId: number, slug: string){
    const eventType = prisma.eventType.findFirst({
        where: {
            hostId,
            slug,
        },
    });
    return eventType;
}

export async function findActiveByHostAndEventSlug(hostId: number, slug: string){
    const eventType = prisma.eventType.findFirst({
        where: {
            hostId,
            slug,
            isActive: true,
        },
    });
    return eventType;
}