import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { PORT } from "./config/env.js";
import { getAll } from "./repositories/user.repository.js";

export async function startServer() {
  await connectDatabase();
  app.listen(PORT, async () => {
    console.log(`[server]: Running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.log("[Server]: Failed to start", err);
  process.exit(1);
});
