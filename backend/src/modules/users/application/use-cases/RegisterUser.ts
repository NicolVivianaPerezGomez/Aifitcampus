// HU-02 Registro de usuarios (por Administrador).
// El Administrador crea la cuenta con rol, programa, área y contraseña.
import bcrypt from "bcrypt";
import { UserPort } from "../../domain/ports/UserPort";
import { AuditPort } from "../../../audits/domain/ports/AuditPort";
import { RegisterUserDto } from "../dto/RegisterUserDto";
import { AppError } from "../../../../shared/utils/AppError";
import { User, ACCOUNT_STATUS } from "../../domain/entities/User";

export class RegisterUser {
  constructor(
    private userPort: UserPort,
    private auditPort: AuditPort,
    private allowedEmailDomain?: string
  ) {}

  async execute(dto: RegisterUserDto, actorUserId: number): Promise<User> {
    // Observación HU-02: validar dominio institucional
    if (
      this.allowedEmailDomain &&
      !dto.email.toLowerCase().endsWith(`@${this.allowedEmailDomain.toLowerCase()}`)
    ) {
      throw new AppError(`El correo debe pertenecer al dominio institucional @${this.allowedEmailDomain}`, 400);
    }

    // CA-02 Correo duplicado
    const existing = await this.userPort.getUserByEmail(dto.email);
    if (existing) {
      throw new AppError("El correo ya está en uso", 409);
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userPort.createUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      authProvider: "local",
      roleId: dto.roleId,
      programId: dto.programId,
      department: dto.department ?? null,
      officeLocation: dto.officeLocation ?? null,
      statusId: ACCOUNT_STATUS.ACTIVE,
    });

    await this.auditPort.register({
      userId: actorUserId,
      action: "CREATE",
      entity: "users",
      description: `Usuario creado: ${user.email}`,
    });

    return user;
  }
}
