import { Bcrypt } from "../../pkg/bcrypt/bcrypt.js";
import { RegisterEntity } from "../data/entity/auth.entity.js";
import { ErrEmailAlreadyExist } from "../errors/sentinel.js";
import { AuthRepository } from "../repository/auth.repository.js";
import { TransactionManager } from "../repository/transactor.js";

export interface AuthUsecase {
  register(registerEntity: RegisterEntity): Promise<RegisterEntity>;
  login(): Promise<void>;
}

export class AuthUseCaseImpl implements AuthUsecase {
  private authRepository: AuthRepository;
  private transactionManager: TransactionManager;
  private bcrypt: Bcrypt;
  constructor(
    authRepository: AuthRepository,
    transactionManager: TransactionManager,
    bcrypt: Bcrypt
  ) {
    this.authRepository = authRepository;
    this.transactionManager = transactionManager;
    this.bcrypt = bcrypt;
  }

  async register(registerEntity: RegisterEntity): Promise<RegisterEntity> {
    try {
      await this.transactionManager.withinTransaction(async (tx) => {
        try {
          const isEmailExist = await this.authRepository.isEmailAlreadyExist(
            registerEntity,
            tx
          );
          if (isEmailExist) {
            throw ErrEmailAlreadyExist;
          }
          registerEntity.password = await this.bcrypt.hash(
            registerEntity.password,
            parseInt(process.env.BCRYPT_ROUNDS || "10")
          );
          const createdUser = await this.authRepository.createUser(
            registerEntity,
            tx
          );
          registerEntity.id = createdUser.id;
          await this.authRepository.createEmployee(registerEntity, tx);
        } catch (e) {
          throw e;
        }
      });
      return registerEntity;
    } catch (e) {
      throw e;
    }
  }

  async login() {}
}
