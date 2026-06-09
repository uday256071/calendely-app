import { prisma } from "../config/database.js";

export async function getAll() {
  const users = prisma.user.findMany();
  return users;
}

export async function getById(id: number) {
  const user = prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
}
