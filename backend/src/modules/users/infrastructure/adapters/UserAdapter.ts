import { DeepPartial, QueryFailedError, Repository } from "typeorm";
import { AppError } from "../../../../shared/utils/AppError";
import { withoutUndefined, isEmpty } from "../../../../shared/utils/persistence.util";
import { AppDataSource } from "../../../../shared/config/data-base";
import { UserModel } from "../persistence/UserModel";
import { UserPort, UserSearchFilter } from "../../domain/ports/UserPort";
import { User, ACCOUNT_STATUS } from "../../domain/entities/User";

// Adaptador: conecta el dominio (User) con la base de datos (UserModel).
export class UserAdapter implements UserPort {
  private repo: Repository<UserModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(UserModel);
  }

  // UserModel (BD) -> User (dominio)
  private toDomain(model: UserModel): User {
    return {
      id: model.id,
      firstName: model.firstName,
      lastName: model.lastName,
      email: model.email,
      password: model.password,
      microsoftId: model.microsoftId,
      authProvider: model.authProvider,
      jobTitle: model.jobTitle,
      department: model.department,
      officeLocation: model.officeLocation,
      mobilePhone: model.mobilePhone,
      businessPhones: model.businessPhones,
      permissions: model.permissions as Record<string, unknown> | null,
      roleId: model.role?.id as number, // siempre se consulta con relations: { role: true }
      role: model.role ? { id: model.role.id, name: model.role.name } : null,
      programId: model.programId,
      statusId: model.statusId,
      createdAt: model.createdAt,
    };
  }

  // User (dominio) -> UserModel (BD): roleId se guarda a través de la relación `role`
  private toModel(user: Partial<User>): DeepPartial<UserModel> {
    const { roleId, role: _role, ...rest } = user;
    return {
      ...rest,
      ...(roleId !== undefined ? { role: { id: roleId } } : {}),
    } as DeepPartial<UserModel>;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const result = await this.repo
      .insert(withoutUndefined(this.toModel(user)) as never)
      .catch(UserAdapter.translateError);
    return (await this.getUserById(result.identifiers[0]!.id)) as User;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    const changes = withoutUndefined(this.toModel(user));
    if (!isEmpty(changes)) await this.repo.update(id, changes as never).catch(UserAdapter.translateError);
    return this.getUserById(id);
  }

  // Error de llave foránea (23503): el rol indicado no existe en la tabla roles
  private static translateError(error: unknown): never {
    if (error instanceof QueryFailedError && (error.driverError as { code?: string })?.code === "23503") {
      throw new AppError("El rol indicado no existe", 400);
    }
    throw error;
  }

  async deactivateUser(id: number): Promise<boolean> {
    const result = await this.repo.update(id, { statusId: ACCOUNT_STATUS.INACTIVE });
    return (result.affected ?? 0) > 0;
  }

  async activateUser(id: number): Promise<boolean> {
    const result = await this.repo.update(id, { statusId: ACCOUNT_STATUS.ACTIVE });
    return (result.affected ?? 0) > 0;
  }

  async getUserById(id: number): Promise<User | null> {
    const found = await this.repo.findOne({ where: { id }, relations: { role: true } });
    return found ? this.toDomain(found) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { email }, relations: { role: true } });
    return found ? this.toDomain(found) : null;
  }

  async getUserByMicrosoftId(microsoftId: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { microsoftId }, relations: { role: true } });
    return found ? this.toDomain(found) : null;
  }

  async searchUsers(filter: UserSearchFilter): Promise<User[]> {
    const qb = this.repo.createQueryBuilder("u").leftJoinAndSelect("u.role", "r");

    if (filter.search) {
      // CA-01: coincidencias parciales por nombre, correo o área (department)
      qb.andWhere(
        "(u.first_name ILIKE :s OR u.last_name ILIKE :s OR u.email ILIKE :s OR u.department ILIKE :s)",
        { s: `%${filter.search}%` }
      );
    }
    if (filter.onlyActive) {
      qb.andWhere("u.status_id = :status", { status: ACCOUNT_STATUS.ACTIVE });
    }

    const found = await qb.getMany();
    return found.map((m) => this.toDomain(m));
  }

  async getAllUsers(): Promise<User[]> {
    const found = await this.repo.find({ relations: { role: true } });
    return found.map((m) => this.toDomain(m));
  }
}
