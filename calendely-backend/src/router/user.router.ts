import { Router } from "express";
import { createUser, findAllUsers, findUserById } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { createUserSchema } from "../dtos/user.dto.js";

export const userRouter: Router = Router(); // we will see the router after /users

userRouter.get("/", findAllUsers);
userRouter.get("/:id", findUserById);
userRouter.post("/",validate(createUserSchema), createUser);
