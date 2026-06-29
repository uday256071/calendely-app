import { prisma } from "../config/database.js";
import { CreateUserDto } from "../dtos/user.dto.js";

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

export async function findByEmail(email: string) {
  const user = prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}


export async function create(data: CreateUserDto) {
  const user = prisma.user.create({ data });
  return user;
}

