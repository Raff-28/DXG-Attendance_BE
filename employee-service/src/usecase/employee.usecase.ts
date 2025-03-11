import { EmployeeEntity } from "../data/entity/employee.entity.js";
import { ErrUserNotFound } from "../errors/http.js";
import { EmployeeRepository } from "../repository/employee.repository.js";
import { TransactionManager } from "../repository/transactor.js";
import { UserRepository } from "../repository/user.repository.js";

export interface EmployeeUsecase {
  getEmployees(): Promise<EmployeeEntity[]>;
  getEmployeeDetails(id: number): Promise<EmployeeEntity>;
  deleteEmployee(id: number): Promise<void>;
}

export class EmployeeUsecaseImpl implements EmployeeUsecase {
  private employeeRepository: EmployeeRepository;
  private userRepository: UserRepository;
  private transactionManager: TransactionManager;
  constructor(
    employeeRepository: EmployeeRepository,
    userRepository: UserRepository,
    transactionManager: TransactionManager
  ) {
    this.employeeRepository = employeeRepository;
    this.userRepository = userRepository;
    this.transactionManager = transactionManager;
  }

  async getEmployees(): Promise<EmployeeEntity[]> {
    try {
      const employees = await this.employeeRepository.selectEmployees();
      return employees;
    } catch (e) {
      throw e;
    }
  }

  async getEmployeeDetails(id: number): Promise<EmployeeEntity> {
    try {
      const employee = await this.employeeRepository.selectEmployeeById(id);
      return employee;
    } catch (e) {
      throw e;
    }
  }

  async deleteEmployee(id: number): Promise<void> {
    try {
      await this.transactionManager.withinTransaction(async (tx) => {
        const employee = await this.employeeRepository.selectEmployeeById(
          id,
          tx
        );
        const userExists = await this.userRepository.checkUserExistById(
          employee.userId,
          tx
        );
        if (!userExists) {
          throw ErrUserNotFound;
        }
        await this.employeeRepository.deleteEmployee(id, tx);
        await this.userRepository.deleteUser(employee.userId, tx);
      });
    } catch (e) {
      throw e;
    }
  }
}
