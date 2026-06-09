import { prisma } from "../config/database.js"

export async function getAll(){
    const users = prisma.user.findMany();
    return users;
}