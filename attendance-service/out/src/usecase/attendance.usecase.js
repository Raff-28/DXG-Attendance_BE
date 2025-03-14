import { ErrAlreadyAttend } from "../errors/http.js";
export class AttendanceUsecaseImpl {
    attendanceRepository;
    transactionManager;
    cloudinary;
    constructor(attendanceRepository, transactionManager, cloudinary) {
        this.attendanceRepository = attendanceRepository;
        this.transactionManager = transactionManager;
        this.cloudinary = cloudinary;
    }
    async createAttendance(attendanceEntity) {
        try {
            await this.transactionManager.withinTransaction(async (tx) => {
                try {
                    const alreadyAttend = await this.attendanceRepository.checkAlreadyAttend(attendanceEntity.employeeId, tx);
                    if (alreadyAttend) {
                        throw ErrAlreadyAttend;
                    }
                    const photoUrl = await this.cloudinary.uploadImage(attendanceEntity.photo, attendanceEntity.mimeType);
                    attendanceEntity.photoUrl = photoUrl;
                    const createdAttendance = await this.attendanceRepository.createAttendance(attendanceEntity, tx);
                    attendanceEntity.id = createdAttendance.id;
                }
                catch (e) {
                    throw e;
                }
            });
        }
        catch (e) {
            throw e;
        }
        return attendanceEntity;
    }
    async getAttendancesByEmployee(attendanceQuery) {
        const { attendances, totalPages } = await this.attendanceRepository.selectAttendancesByEmployee(attendanceQuery);
        return { attendances, totalPages };
    }
}
