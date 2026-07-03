import slug from "slug";
import { CreateEventTypeDto, UpdateEventTypeDto } from "../dtos/event-type.dto.js";
import { create, findActiveByHostAndEventSlug, findByHostId, findById, remove, slugExistsForHost, update } from "../repositories/event-type-repository.js";
import { conflict, notFound } from "../utils/api-error.js";
import { getById as getUserById } from "../repositories/user.repository.js";

export async function listEventTypes(hostId: number){
    const eventTypes = await findByHostId(hostId);
    return eventTypes;
}

export async function createEventType(hostId: number, data: CreateEventTypeDto){
    const slugPassed = data.slug ?? slug(data.title,{lower:true});

    if(!slugPassed){
        throw conflict('Could not generate a slug for the event type')
    }
    const slugExists = await slugExistsForHost(hostId, slugPassed);
    if(slugExists){
        throw conflict("Slug already exists");
    }

    const eventType = await create(hostId, {...data, slug:slugPassed});
    return eventType;
}


export async function removeEventType(hostId:number, id: number){
    const eventType = await findById(id);
    if(eventType?.hostId !== hostId){
        throw conflict("You are not authorized to delete this event type");
    }
    await remove(id);
}

export async function getEventTypePublic(hostId:number, slug:string){
    const eventType = await findActiveByHostAndEventSlug(hostId,slug);
    if(!eventType){
        throw notFound("Event type not found");
    }

    const host = await getUserById(hostId);
    if(!host){
        throw notFound("Host not found");
    }   

    return {
        eventType : {
            id: eventType.id,
            title: eventType.title,
            description: eventType.description,
            durationMinutes: eventType.durationMinutes,
            locationType: eventType.locationType
        },
        host: {
            name: host.name
        }
    };
}

export async function getEventTypeById(hostId: number, id: number) {
    const eventType = await findById(id);
    if (!eventType) {
        throw notFound("Event type not found");
    }
    if (eventType.hostId !== hostId) {
        throw conflict("You are not authorized to view this event type");
    }
    return eventType;
}

export async function updateEventType(hostId: number, id: number, data: UpdateEventTypeDto) {
    const eventType = await findById(id);
    if (!eventType) {
        throw notFound("Event type not found");
    }
    if (eventType.hostId !== hostId) {
        throw conflict("You are not authorized to update this event type");
    }

    if (data.slug && data.slug !== eventType.slug) {
        const slugExists = await slugExistsForHost(hostId, data.slug);
        if (slugExists) {
            throw conflict("Slug already exists");
        }
    }

    const updatedEventType = await update(id, data);
    return updatedEventType;
}
