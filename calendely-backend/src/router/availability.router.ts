import { Router } from "express";
import {
  listRules,
  createRule,
  updateRule,
  removeRule,
  listExceptions,
  createException,
  updateException,
  removeException,
} from "../controllers/availability.controller.js";
import { validate } from "../middlewares/validate.js";
import { requireUserid } from "../middlewares/require-userid.js";
import {
  createAvailabilityRuleSchema,
  updateAvailabilityRuleSchema,
  createAvailabilityExceptionSchema,
  updateAvailabilityExceptionSchema,
} from "../dtos/availability.dto.js";

export const availabilityRouter: Router = Router();

// All availability routes require a valid user ID in headers
availabilityRouter.use(requireUserid);

// --- Availability Rules ---
availabilityRouter.get("/rules", listRules);
availabilityRouter.post("/rules", validate(createAvailabilityRuleSchema), createRule);
availabilityRouter.put("/rules/:id", validate(updateAvailabilityRuleSchema), updateRule);
availabilityRouter.delete("/rules/:id", removeRule);

// --- Availability Exceptions ---
availabilityRouter.get("/exceptions", listExceptions);
availabilityRouter.post("/exceptions", validate(createAvailabilityExceptionSchema), createException);
availabilityRouter.put("/exceptions/:id", validate(updateAvailabilityExceptionSchema), updateException);
availabilityRouter.delete("/exceptions/:id", removeException);
