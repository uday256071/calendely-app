import { Router } from "express";
import { list, getById, create, update, remove } from "../controllers/event-type.controller.js";
import { validate } from "../middlewares/validate.js";
import { createEventTypeSchema, updateEventTypeSchema } from "../dtos/event-type.dto.js";
import { requireUserid } from "../middlewares/require-userid.js";

export const eventTypeRouter: Router = Router();

eventTypeRouter.use(requireUserid);

eventTypeRouter.get("/", list);
eventTypeRouter.get("/:id", getById);
eventTypeRouter.post("/", validate(createEventTypeSchema), create);
eventTypeRouter.put("/:id", validate(updateEventTypeSchema), update);
eventTypeRouter.delete("/:id", remove);
