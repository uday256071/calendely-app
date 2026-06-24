// Configures the setting for the express app object

import express, { Express, NextFunction, Request, Response } from "express";
import { userRouter } from "./router/user.router.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app: Express = express();

function logRequest1(req: Request, _res: Response, next: NextFunction) {
  console.log("Logger 1 URL:", req.url);
  next();
}

function logRequest2(req: Request, _res: Response, next: NextFunction) {
  console.log("Logger 2 URL:", req.url);
  next();
}

const logRequest = [logRequest1, logRequest2];

app.use(express.json()); //This will help express to deserialize the request body into a JS Object
app.use(express.text());
app.use(express.urlencoded());

app.get("/health", logRequest, (_req: Request, res: Response) => {
  res.json({
    status: "ok!",
    timestamp: new Date().toISOString(),
  });
});


//Express router based routes
app.use("/api/users", userRouter); //if the route starts with /users, userRouter will handle it


//at the last we mention our error handling middleware
app.use(errorHandler);
export { app };
