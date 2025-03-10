import { BcryptImpl } from "../pkg/bcrypt/bcrypt.js";
import { AuthController } from "../src/controller/auth.controller.js";
import { AuthRepositoryImpl } from "../src/repository/auth.repository.js";
import { TransactionManagerImpl } from "../src/repository/transactor.js";
import { setupRouter } from "../src/router/setup.js";
import { AuthUseCaseImpl } from "../src/usecase/auth.usecase.js";
import { closeConnection, openConnection } from "./database.js";
import { setupEnv } from "./env.js";

export async function startServer() {
  setupEnv();
  const db = await openConnection();
  const authController = new AuthController(
    new AuthUseCaseImpl(
      new AuthRepositoryImpl(db),
      new TransactionManagerImpl(db),
      new BcryptImpl()
    )
  );

  const r = setupRouter(authController);
  const portUsed = parseInt(process.env.SERVICE_PORT || "4001");
  const server = r.listen(portUsed, () => {
    console.log(`Auth service is running on port ${portUsed}`);
  });

  const shutDown = async () => {
    console.log("Shutting down server");
    await closeConnection(db);
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  };

  process.on("SIGINT", shutDown);
  process.on("SIGTERM", shutDown);
}
