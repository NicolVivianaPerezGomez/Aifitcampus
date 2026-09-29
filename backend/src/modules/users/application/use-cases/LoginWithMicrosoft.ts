// HU-01 Inicio de sesión con credenciales institucionales Microsoft 365.
// Único mecanismo de autenticación: no existe contraseña local. La cuenta debe
// haber sido creada previamente por un Administrador (HU-02) con su rol,
// programa y área asignados; Microsoft solo prueba la identidad y aporta los
// datos de perfil (job_title, department, office_location, mobile_phone,
// business_phones) que el diccionario ya marca Azure AD".
import { UserPort } from "../../domain/ports/UserPort";
import { MicrosoftProfileDto } from "../dto/MicrosoftProfileDto";
import { LoginResult } from "../dto/LoginResultDto";
import { signToken } from "../../../../shared/utils/jwt.util";
import { AppError } from "../../../../shared/utils/AppError";
import { ACCOUNT_STATUS, User } from "../../domain/entities/User";

export class LoginWithMicrosoft {
  constructor(private userPort: UserPort, private allowedEmailDomain?: string) {}

  async execute(profile: MicrosoftProfileDto): Promise<LoginResult> {
    if (
      this.allowedEmailDomain &&
      !profile.email.endsWith(`@${this.allowedEmailDomain.toLowerCase()}`)
    ) {
      throw new AppError(`El correo debe pertenecer al dominio institucional @${this.allowedEmailDomain}`, 403);
    }

    // Preferimos localizar por microsoft_id (ya vinculado); si es el primer
    // login, se localiza por correo institucional.
    let user = await this.userPort.getUserByMicrosoftId(profile.microsoftId);
    if (!user) {
      user = await this.userPort.getUserByEmail(profile.email);
    }

    // Si el usuario no existe, se rechaza el login (debe ser registrado previamente por un admin)
    if (!user) {
      throw new AppError("No existe una cuenta registrada para este correo. Contacta al administrador.", 403);
    }

    // HU-05 CA-03 Bloqueo de acceso a usuario inactivo
    if (user.statusId !== ACCOUNT_STATUS.ACTIVE) {
      throw new AppError("La cuenta se encuentra inactiva", 403);
    }

    // Validar que el usuario tenga un rol asignado
    if (!user.roleId) {
      throw new AppError("El usuario no tiene un rol asignado. Contacta al administrador.", 403);
    }

    // Validar que el usuario tenga un programa asignado
    if (!user.programId) {
      throw new AppError("El usuario no tiene un programa asignado. Contacta al administrador.", 403);
    }

    const updated = await this.userPort.updateUser(user.id, {
      microsoftId: profile.microsoftId,
      authProvider: "microsoft",
      firstName: profile.firstName || user.firstName,
      lastName: profile.lastName || user.lastName,
      jobTitle: profile.jobTitle ?? user.jobTitle,
      department: profile.department ?? user.department,
      officeLocation: profile.officeLocation ?? user.officeLocation,
      mobilePhone: profile.mobilePhone ?? user.mobilePhone,
      businessPhones: profile.businessPhones ?? user.businessPhones,
    }) as User;

    const token = signToken({ userId: updated.id, email: updated.email, roleId: updated.roleId });

    return {
      token,
      user: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        roleId: updated.roleId,
      },
    };
    // Nota CA-03 (expiración por inactividad): controlada por JWT_EXPIRES_IN.
  }
}
