import { Request, Response } from "express";
import {
  listRules as listRulesService,
  createRule as createRuleService,
  updateRule as updateRuleService,
  removeRule as removeRuleService,
  listExceptions as listExceptionsService,
  createException as createExceptionService,
  updateException as updateExceptionService,
  removeException as removeExceptionService,
} from "../services/availability.service.js";
import { sendSuccess } from "../utils/api-response.js";

// --- Availability Rules ---

export async function listRules(req: Request, res: Response) {
  const userId = req.userId!;
  const response = await listRulesService(userId);
  sendSuccess(res, response);
}

export async function createRule(req: Request, res: Response) {
  const userId = req.userId!;
  const response = await createRuleService(userId, req.body);
  sendSuccess(res, response, 201, "Availability rule created successfully");
}

export async function updateRule(req: Request, res: Response) {
  const userId = req.userId!;
  const ruleId = Number(req.params.id);
  const response = await updateRuleService(userId, ruleId, req.body);
  sendSuccess(res, response, 200, "Availability rule updated successfully");
}

export async function removeRule(req: Request, res: Response) {
  const userId = req.userId!;
  const ruleId = Number(req.params.id);
  await removeRuleService(userId, ruleId);
  sendSuccess(res, null, 200, "Availability rule deleted successfully");
}

// --- Availability Exceptions ---

export async function listExceptions(req: Request, res: Response) {
  const userId = req.userId!;
  const response = await listExceptionsService(userId);
  sendSuccess(res, response);
}

export async function createException(req: Request, res: Response) {
  const userId = req.userId!;
  const response = await createExceptionService(userId, req.body);
  sendSuccess(res, response, 201, "Availability exception created successfully");
}

export async function updateException(req: Request, res: Response) {
  const userId = req.userId!;
  const exceptionId = Number(req.params.id);
  const response = await updateExceptionService(userId, exceptionId, req.body);
  sendSuccess(res, response, 200, "Availability exception updated successfully");
}

export async function removeException(req: Request, res: Response) {
  const userId = req.userId!;
  const exceptionId = Number(req.params.id);
  await removeExceptionService(userId, exceptionId);
  sendSuccess(res, null, 200, "Availability exception deleted successfully");
}
