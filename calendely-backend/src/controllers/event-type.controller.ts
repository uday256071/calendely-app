import { Request, Response } from "express";
import {
  listEventTypes,
  getEventTypeById,
  createEventType,
  updateEventType,
  removeEventType,
  getEventTypePublic,
} from "../services/event-types.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function list(req: Request, res: Response) {
  const hostId = req.userId!;
  const response = await listEventTypes(hostId);
  sendSuccess(res, response);
}

export async function getById(req: Request, res: Response) {
  const hostId = req.userId!;
  const id = Number(req.params.id);
  const response = await getEventTypeById(hostId, id);
  sendSuccess(res, response);
}

export async function create(req: Request, res: Response) {
  const hostId = req.userId!;
  const response = await createEventType(hostId, req.body);
  sendSuccess(res, response, 201, "Event type created successfully");
}

export async function update(req: Request, res: Response) {
  const hostId = req.userId!;
  const id = Number(req.params.id);
  const response = await updateEventType(hostId, id, req.body);
  sendSuccess(res, response, 200, "Event type updated successfully");
}

export async function remove(req: Request, res: Response) {
  const hostId = req.userId!;
  const id = Number(req.params.id);
  await removeEventType(hostId, id);
  sendSuccess(res, null, 200, "Event type deleted successfully");
}

export async function getPublicEventType(req: Request, res: Response) {
  const { userId, slug } = req.params;
  const response = await getEventTypePublic(Number(userId), String(slug));
  sendSuccess(res, response);
}
