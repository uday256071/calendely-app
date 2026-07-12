import { prisma } from "../config/database.js";

export async function findBookedSlotsByHostInRange(
    hostId: number,
    start: Date,
    end: Date
){
    return prisma.slot.findMany({
        where: {
            hostId,
            startAt: {
                gte: start,
                lte: end,
            },
            status: "BOOKED"
        },
    });
}