import { CloudinaryImpl } from "../pkg/cloudinary/cloudinary.js";
import { MulterImpl } from "../pkg/multer/multer.js";
import { AttendanceController } from "../src/controller/attendance.controller.js";
import { AttendanceRepositoryImpl } from "../src/repository/attendance.repository.js";
import { TransactionManagerImpl } from "../src/repository/transactor.js";
import { setupRouter } from "../src/router/setup.js";
import { AttendanceUsecaseImpl } from "../src/usecase/attendance.usecase.js";
import { closeConnection, openConnection } from "./database.js";
import { setupEnv } from "./env.js";
export async function startServer() {
    setupEnv();
    const db = await openConnection();
    const attendanceController = new AttendanceController(new AttendanceUsecaseImpl(new AttendanceRepositoryImpl(db), new TransactionManagerImpl(db), new CloudinaryImpl()));
    const multer = new MulterImpl();
    const r = setupRouter(attendanceController, multer.upload);
    const portUsed = parseInt(process.env.SERVICE_PORT || "4003");
    const server = r.listen(portUsed, () => {
        console.log(`Attendance service is running on port ${portUsed}`);
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
