import {
  CreateAvailabilityRuleDto,
  UpdateAvailabilityRuleDto,
  CreateAvailabilityExceptionDto,
  UpdateAvailabilityExceptionDto,
} from "../dtos/availability.dto.js";
import {
  findRulesByUser,
  findRuleById,
  createRule as repoCreateRule,
  updateRule as repoUpdateRule,
  removeRule as repoRemoveRule,
  findExceptionByUser,
  findExceptionById,
  createException as createExceptionRepo,
  updateException as updateExceptionRepo,
  removeException as removeExceptionRepo,
} from "../repositories/availability.repository.js";
import { conflict, notFound } from "../utils/api-error.js";

// --- Availability Rules ---

export async function listRules(userId: number) {
  return findRulesByUser(userId);
}

export async function createRule(userId: number, data: CreateAvailabilityRuleDto) {
  return repoCreateRule(userId, data);
}

export async function removeRule(userId: number, ruleId: number) {
  const rule = await findRuleById(ruleId);
  if (!rule) {
    throw notFound("Availability rule not found");
  }
  if (rule.userId !== userId) {
    throw conflict("You are not authorized to delete this availability rule");
  }
  await repoRemoveRule(ruleId);
}

export async function updateRule(
  userId: number,
  ruleId: number,
  data: UpdateAvailabilityRuleDto
) {
  const rule = await findRuleById(ruleId);
  if (!rule) {
    throw notFound("Availability rule not found");
  }
  if (rule.userId !== userId) {
    throw conflict("You are not authorized to update this availability rule");
  }
  return repoUpdateRule(ruleId, data);
}

// --- Availability Exceptions ---

export async function listExceptions(userId: number) {
  return findExceptionByUser(userId);
}

export async function createException(userId: number, data: CreateAvailabilityExceptionDto) {
  return createExceptionRepo(userId, data);
}

export async function removeException(userId: number, exceptionId: number) {
  const exception = await findExceptionById(exceptionId);
  if (!exception) {
    throw notFound("Availability exception not found");
  }
  if (exception.userId !== userId) {
    throw conflict("You are not authorized to delete this availability exception");
  }
  await removeExceptionRepo(exceptionId);
}

export async function updateException(
  userId: number,
  exceptionId: number,
  data: UpdateAvailabilityExceptionDto
) {
  const exception = await findExceptionById(exceptionId);
  if (!exception) {
    throw notFound("Availability exception not found");
  }
  if (exception.userId !== userId) {
    throw conflict("You are not authorized to update this availability exception");
  }
  return updateExceptionRepo(exceptionId, data);
}
