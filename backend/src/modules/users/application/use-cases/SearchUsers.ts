// HU-05 Búsqueda de usuarios (CA-01)
import { UserPort, UserSearchFilter } from "../../domain/ports/UserPort";
import { User } from "../../domain/entities/User";

export class SearchUsers {
  constructor(private userPort: UserPort) {}

  async execute(filter: UserSearchFilter): Promise<User[]> {
    return this.userPort.searchUsers(filter);
  }
}
