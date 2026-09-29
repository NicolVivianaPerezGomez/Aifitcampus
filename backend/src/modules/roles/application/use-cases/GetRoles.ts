import { RolePort } from "../../domain/ports/RolePort";
import { Role } from "../../domain/entities/Role";

export class GetRoles {
  constructor(private rolePort: RolePort) {}

  async execute(): Promise<Role[]> {
    return this.rolePort.findAll();
  }
}
