import { Role } from "../entities/Role";

export interface RolePort {
  create(role: Omit<Role, "id">): Promise<Role>;
  rename(id: number, name: string): Promise<Role | null>;
  remove(id: number): Promise<void>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  countUsersByRole(roleId: number): Promise<number>;
}
