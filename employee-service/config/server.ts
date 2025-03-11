import { EmployeeController } from "../src/controller/employee.controller.js";
import { AttendanceRepositoryImpl } from "../src/repository/attendance.repository.js";
import { EmployeeRepositoryImpl } from "../src/repository/employee.repository.js";
import { TransactionManagerImpl } from "../src/repository/transactor.js";
import { UserRepositoryImpl } from "../src/repository/user.repository.js";
import { setupRouter } from "../src/router/setup.js";
import { EmployeeUsecaseImpl } from "../src/usecase/employee.usecase.js";
import { closeConnection, openConnection } from "./database.js";
import { setupEnv } from "./env.js";

export async function startServer() {
  setupEnv();
  const db = await openConnection();

  const r = setupRouter(
    new EmployeeController(
      new EmployeeUsecaseImpl(
        new EmployeeRepositoryImpl(db),
        new UserRepositoryImpl(db),
        new AttendanceRepositoryImpl(db),
        new TransactionManagerImpl(db)
      )
    )
  );
  const portUsed = parseInt(process.env.SERVICE_PORT || "4002");
  const server = r.listen(portUsed, () => {
    console.log(`Employee service is running on port ${portUsed}`);
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
