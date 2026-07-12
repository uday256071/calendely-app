import { prisma } from "../config/database.js";
import {
  CreateAvailabilityRuleDto,
  UpdateAvailabilityRuleDto,
  CreateAvailabilityExceptionDto,
  UpdateAvailabilityExceptionDto,
} from "../dtos/availability.dto.js";

// Rules-related repository methods

export async function findRulesByUser(userId: number, onlyActive?: boolean) {
  return prisma.availabilityRule.findMany({
    where: {
      userId,
      ...(onlyActive !== undefined ? { isActive: onlyActive } : {}),
    },
    orderBy: [
      { weekDay: "asc" },
      { startTime: "asc" },
    ],
  });
}

export async function findActiveRulesByUser(userId: number) {
  return findRulesByUser(userId, true);
}

export async function findRuleById(id: number) {
  return prisma.availabilityRule.findUnique({
    where: { id },
  });
}

export async function createRule(userId: number, data: CreateAvailabilityRuleDto) {
  return prisma.availabilityRule.create({
    data: {
      userId,
      ...data,
    },
  });
}

export async function updateRule(id: number, data: UpdateAvailabilityRuleDto) {
  return prisma.availabilityRule.update({
    where: { id },
    data,
  });
}

export async function removeRule(id: number) {
  return prisma.availabilityRule.delete({
    where: { id },
  });
}

// Exception-related repository methods
// Note: Prisma model spelling is AvailabiltyException (no 'i' in 'bilty')

export async function findExceptionByUser(userId: number) {
  return prisma.availabiltyException.findMany({
    where: { userId },
    orderBy: [
      { date: "asc" }
    ],
  });
}

export async function findExceptionById(id: number) {
  return prisma.availabiltyException.findUnique({
    where: { id },
  });
}

export async function createException(userId: number, data: CreateAvailabilityExceptionDto) {
  return prisma.availabiltyException.create({
    data: {
      userId,
      ...data,
      date: new Date(data.date),
      startTime: data.startTime ?? "",
      endTime: data.endTime ?? "",
    },
  });
}

export async function updateException(id: number, data: UpdateAvailabilityExceptionDto) {
  return prisma.availabiltyException.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
}

export async function removeException(id: number) {
  return prisma.availabiltyException.delete({
    where: { id },
  });
}

export async function findExceptionsByUserInRange(
  userId: number,
  startDate: Date,
  endDate: Date
) {
  return prisma.availabiltyException.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: [
      { date: "asc" },
      { startTime: "asc" },
    ],
  });
}
