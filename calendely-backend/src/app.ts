// Configures the setting for the express app object

import express, { Express } from "express";
import { userRouter } from "./router/user.router.js";

const app: Express = express();

app.get("/health", (_req, res) => {
  res.json({
    status: "ok!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/users", userRouter);  //if the route starts with /users, userRouter will handle it

export { app };
