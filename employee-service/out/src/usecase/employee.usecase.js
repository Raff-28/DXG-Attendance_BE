import { ErrEmployeeNotFound, ErrUserNotFound } from "../errors/http.js";
export class EmployeeUsecaseImpl {
    employeeRepository;
    userRepository;
    attendanceRepository;
    transactionManager;
    constructor(employeeRepository, userRepository, attendanceRepository, transactionManager) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
        this.transactionManager = transactionManager;
    }
    async getEmployees() {
        try {
            const employees = await this.employeeRepository.selectEmployees();
            return employees;
        }
        catch (e) {
            throw e;
        }
    }
    async getEmployeeDetails(id) {
        try {
            const employee = await this.employeeRepository.selectEmployeeById(id);
            return employee;
        }
        catch (e) {
            throw e;
        }
    }
    async deleteEmployee(id) {
        try {
            await this.transactionManager.withinTransaction(async (tx) => {
                const employee = await this.employeeRepository.selectEmployeeById(id, tx);
                const userExists = await this.userRepository.checkUserExistById(employee.userId, tx);
                if (!userExists) {
                    throw ErrUserNotFound;
                }
                await this.userRepository.deleteUser(employee.userId, tx);
                await this.employeeRepository.deleteEmployee(id, tx);
                await this.attendanceRepository.deleteAttendancesByEmployeeId(id, tx);
            });
        }
        catch (e) {
            throw e;
        }
    }
    async getEmployeeByUserId(userId) {
        try {
            const employee = await this.employeeRepository.selectEmployeeByUserId(userId);
            return employee;
        }
        catch (e) {
            throw e;
        }
    }
    async updateEmployee(employee) {
        try {
            const employeeExists = await this.employeeRepository.checkEmployeeExist(employee.id);
            if (!employeeExists) {
                throw ErrEmployeeNotFound;
            }
            await this.employeeRepository.updateEmployee(employee);
        }
        catch (e) {
            throw e;
        }
    }
}
