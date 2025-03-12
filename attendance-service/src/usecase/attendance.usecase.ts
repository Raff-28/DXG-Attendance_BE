import { Cloudinary } from "../../pkg/cloudinary/cloudinary.js";
import {
  AttendanceEntity,
  AttendanceQueryParamEntity,
} from "../data/entity/attendance.entity.js";
import { ErrAlreadyAttend } from "../errors/http.js";
import { AttendanceRepository } from "../repository/attendance.repository.js";
import { TransactionManager } from "../repository/transactor.js";

export interface AttendanceUsecase {
  createAttendance(
    attendanceEntity: AttendanceEntity
  ): Promise<AttendanceEntity>;
  getAttendancesByEmployee(
    attendanceQuery: AttendanceQueryParamEntity
  ): Promise<AttendanceEntity[]>;
}

export class AttendanceUsecaseImpl implements AttendanceUsecase {
  private attendanceRepository: AttendanceRepository;
  private transactionManager: TransactionManager;
  private cloudinary: Cloudinary;
  constructor(
    attendanceRepository: AttendanceRepository,
    transactionManager: TransactionManager,
    cloudinary: Cloudinary
  ) {
    this.attendanceRepository = attendanceRepository;
    this.transactionManager = transactionManager;
    this.cloudinary = cloudinary;
  }

  async createAttendance(
    attendanceEntity: AttendanceEntity
  ): Promise<AttendanceEntity> {
    try {
      await this.transactionManager.withinTransaction(async (tx) => {
        try {
          const alreadyAttend =
            await this.attendanceRepository.checkAlreadyAttend(
              attendanceEntity.employeeId,
              tx
            );
          if (alreadyAttend) {
            throw ErrAlreadyAttend;
          }
          const photoUrl = await this.cloudinary.uploadImage(
            attendanceEntity.photo,
            attendanceEntity.mimeType
          );
          attendanceEntity.photoUrl = photoUrl;
          const createdAttendance =
            await this.attendanceRepository.createAttendance(
              attendanceEntity,
              tx
            );
          attendanceEntity.id = createdAttendance.id;
        } catch (e) {
          throw e;
        }
      });
    } catch (e) {
      throw e;
    }
    return attendanceEntity;
  }

  async getAttendancesByEmployee(
    attendanceQuery: AttendanceQueryParamEntity
  ): Promise<AttendanceEntity[]> {
    const attendances =
      await this.attendanceRepository.selectAttendancesByEmployee(
        attendanceQuery
      );
    return attendances;
  }
}
