import { UserToken, } from "../data/entity/auth.entity.js";
import { ErrEmailAlreadyExist, ErrInvalidEmailOrPassword, ErrUserDoesNotExist, } from "../errors/sentinel.js";
export class AuthUseCaseImpl {
    authRepository;
    transactionManager;
    bcrypt;
    jwt;
    constructor(authRepository, transactionManager, bcrypt, jwt) {
        this.authRepository = authRepository;
        this.transactionManager = transactionManager;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
    }
    async register(registerEntity) {
        try {
            await this.transactionManager.withinTransaction(async (tx) => {
                try {
                    const isEmailExist = await this.authRepository.isEmailAlreadyExist(registerEntity, tx);
                    if (isEmailExist) {
                        throw ErrEmailAlreadyExist;
                    }
                    registerEntity.password = await this.bcrypt.hash(registerEntity.password, parseInt(process.env.BCRYPT_ROUNDS || "10"));
                    const createdUser = await this.authRepository.createUser(registerEntity, tx);
                    registerEntity.id = createdUser.id;
                    await this.authRepository.createEmployee(registerEntity, tx);
                }
                catch (e) {
                    throw e;
                }
            });
            return registerEntity;
        }
        catch (e) {
            throw e;
        }
    }
    async login(loginEntity) {
        try {
            const user = await this.authRepository.selectUserByEmail(loginEntity.email);
            const isPasswordMatch = await this.bcrypt.compare(loginEntity.password, user.password);
            if (!isPasswordMatch) {
                throw ErrInvalidEmailOrPassword;
            }
            const tokenString = this.jwt.sign({ id: user.id }, { expiresIn: "1d" });
            return new UserToken(tokenString);
        }
        catch (e) {
            if (e === ErrUserDoesNotExist) {
                throw ErrInvalidEmailOrPassword;
            }
            throw e;
        }
    }
    async getUserData(token) {
        try {
            const payload = this.jwt.verify(token);
            const user = await this.authRepository.selectUserById(payload.id);
            return user;
        }
        catch (e) {
            throw e;
        }
    }
}
