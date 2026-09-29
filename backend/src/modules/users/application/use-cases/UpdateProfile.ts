// HU-03 Edición de perfil
import { UserPort } from "../../domain/ports/UserPort";
import { UpdateProfileDto } from "../dto/UpdateProfileDto";
import { AppError } from "../../../../shared/utils/AppError";
import { User } from "../../domain/entities/User";

export class UpdateProfile {
  constructor(private userPort: UserPort) {}

  async execute(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userPort.getUserById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }
    const updated = await this.userPort.updateUser(userId, dto);
    if (!updated) {
      throw new AppError("No fue posible actualizar el perfil", 500);
    }
    return updated;
  }
}
