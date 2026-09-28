import { User } from "../entities/User";

export interface UserSearchFilter {
  search?: string; // coincide contra nombre, correo o área/departamento (HU-05 CA-01)
  onlyActive?: boolean;
}

export interface UserPort {
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | null>;
  deactivateUser(id: number): Promise<boolean>;
  activateUser(id: number): Promise<boolean>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByMicrosoftId(microsoftId: string): Promise<User | null>;
  searchUsers(filter: UserSearchFilter): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
}
