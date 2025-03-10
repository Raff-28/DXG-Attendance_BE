import { Bcrypt } from "../../pkg/bcrypt/bcrypt.js";
import { Jwt } from "../../pkg/jwt/jwt.js";
import {
  LoginEntity,
  RegisterEntity,
  UserToken,
} from "../data/entity/auth.entity.js";
import {
  ErrEmailAlreadyExist,
  ErrInvalidEmailOrPassword,
  ErrUserDoesNotExist,
} from "../errors/sentinel.js";
import { AuthRepository } from "../repository/auth.repository.js";
import { TransactionManager } from "../repository/transactor.js";

export interface AuthUsecase {
  register(registerEntity: RegisterEntity): Promise<RegisterEntity>;
  login(loginEntity: LoginEntity): Promise<UserToken>;
}

export class AuthUseCaseImpl implements AuthUsecase {
  private authRepository: AuthRepository;
  private transactionManager: TransactionManager;
  private bcrypt: Bcrypt;
  private jwt: Jwt;
  constructor(
    authRepository: AuthRepository,
    transactionManager: TransactionManager,
    bcrypt: Bcrypt,
    jwt: Jwt
  ) {
    this.authRepository = authRepository;
    this.transactionManager = transactionManager;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
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

  async login(loginEntity: LoginEntity) {
    try {
      const user = await this.authRepository.selectUserByEmail(loginEntity);
      const isPasswordMatch = await this.bcrypt.compare(
        loginEntity.password,
        user.password
      );
      if (!isPasswordMatch) {
        throw ErrInvalidEmailOrPassword;
      }
      const tokenString = this.jwt.sign({ id: user.id }, { expiresIn: "1d" });
      return new UserToken(tokenString);
    } catch (e) {
      if (e === ErrUserDoesNotExist) {
        throw ErrInvalidEmailOrPassword;
      }
      throw e;
    }
  }
}
