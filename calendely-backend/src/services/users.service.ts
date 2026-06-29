import { CreateUserDto } from "../dtos/user.dto.js";
import {
  create,
  findByEmail,
  getAll,
  getById,
} from "../repositories/user.repository.js";
import { notFound } from "../utils/api-error.js";

export async function findAllUsers() {
  const users = await getAll();
  return users;
}

export async function findUserById(id: number) {
  const user = await getById(id);
  if (!user) {
    throw notFound("User not found");
  }
  return user;
}

export async function createUser(data: CreateUserDto) {
  const existingUser = await findByEmail(data.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await create(data);
  return user;
}
