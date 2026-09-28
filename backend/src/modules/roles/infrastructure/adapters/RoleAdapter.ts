import { Repository, QueryFailedError } from "typeorm";
import { AppDataSource } from "../../../../shared/config/data-base";
import { RoleModel } from "../persistence/RoleModel";
import { UserModel } from "../../../users/infrastructure/persistence/UserModel";
import { RolePort } from "../../domain/ports/RolePort";
import { Role } from "../../domain/entities/Role";
import { AppError } from "../../../../shared/utils/AppError";

// Adaptador: conecta el dominio (Role) con la base de datos (RoleModel).
export class RoleAdapter implements RolePort {
  private repo: Repository<RoleModel>;
  private userRepo: Repository<UserModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(RoleModel);
    this.userRepo = AppDataSource.getRepository(UserModel);
  }

  // RoleModel (BD) -> Role (dominio)
  private toDomain(model: RoleModel): Role {
    return { id: model.id, name: model.name };
  }

  async create(role: Omit<Role, "id">): Promise<Role> {
    const result = await this.repo.insert({ name: role.name });
    return (await this.findById(result.identifiers[0]!.id)) as Role;
  }

  async rename(id: number, name: string): Promise<Role | null> {
    await this.repo.update(id, { name });
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (error) {
      // Salvaguarda adicional: si la FK users.role_id bloquea el borrado
      // (por ejemplo por una condición de carrera), se traduce a un error claro.
      if (error instanceof QueryFailedError) {
        throw new AppError("No es posible eliminar el rol: está referenciado por usuarios", 409);
      }
      throw error;
    }
  }

  async findById(id: number): Promise<Role | null> {
    const found = await this.repo.findOneBy({ id });
    return found ? this.toDomain(found) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const found = await this.repo.findOneBy({ name });
    return found ? this.toDomain(found) : null;
  }

  async findAll(): Promise<Role[]> {
    const found = await this.repo.find();
    return found.map((m) => this.toDomain(m));
  }

  async countUsersByRole(roleId: number): Promise<number> {
    return this.userRepo.count({ where: { role: { id: roleId } } });
  }
}
