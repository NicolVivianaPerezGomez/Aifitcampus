import { Request, Response } from "express";
import crypto from "crypto";
import { msalClient, MS_LOGIN_SCOPES } from "../../../../shared/config/msal.config";
import envs from "../../../../shared/config/environment-vars";
import { fetchMicrosoftProfile } from "../../../../shared/utils/graph.util";
import { UserAdapter } from "../adapters/UserAdapter";
import { LoginWithMicrosoft } from "../../application/use-cases/LoginWithMicrosoft";
import { AppError } from "../../../../shared/utils/AppError";

const userAdapter = new UserAdapter();

// Almacén simple de "state" (anti-CSRF del flujo OAuth) en memoria, con TTL.
// Suficiente para una sola instancia del backend; si se despliega con varias
// réplicas se debe reemplazar por un store compartido (ej. Redis).
const pendingStates = new Map<string, number>();
const STATE_TTL_MS = 5 * 60 * 1000;

const purgeExpiredStates = () => {
  const now = Date.now();
  for (const [state, expiresAt] of pendingStates) {
    if (expiresAt < now) pendingStates.delete(state);
  }
};

export class MicrosoftAuthController {
  // HU-01: redirige al usuario al login institucional de Microsoft 365
  static async redirect(_req: Request, res: Response) {
    purgeExpiredStates();
    const state = crypto.randomBytes(16).toString("hex");
    pendingStates.set(state, Date.now() + STATE_TTL_MS);

    const authUrl = await msalClient.getAuthCodeUrl({
      scopes: MS_LOGIN_SCOPES,
      redirectUri: envs.AZURE_REDIRECT_URI,
      state,
    });

    return res.redirect(authUrl);
  }

  // Callback configurado en Azure AD como redirect URI
  static async callback(req: Request, res: Response) {
    try {
      const { code, state, error, error_description } = req.query as Record<string, string>;

      if (error) {
        throw new AppError(error_description || "El usuario canceló el inicio de sesión con Microsoft", 401);
      }

      if (!state || !pendingStates.has(state)) {
        throw new AppError("Solicitud de inicio de sesión inválida o expirada", 400);
      }
      pendingStates.delete(state);

      if (!code) {
        throw new AppError("Código de autorización no recibido", 400);
      }

      const tokenResponse = await msalClient.acquireTokenByCode({
        code,
        scopes: MS_LOGIN_SCOPES,
        redirectUri: envs.AZURE_REDIRECT_URI,
      });

      if (!tokenResponse?.accessToken) {
        throw new AppError("No fue posible completar la autenticación con Microsoft", 502);
      }

      const profile = await fetchMicrosoftProfile(tokenResponse.accessToken);
      const result = await new LoginWithMicrosoft(userAdapter, envs.ALLOWED_EMAIL_DOMAIN).execute(profile);

      // Se entrega el JWT propio de la app al frontend (Angular) vía fragmento
      // de URL para no exponerlo en logs del servidor de destino.
      return res.redirect(`${envs.FRONTEND_URL}/auth/callback#token=${result.token}`);
    } catch (error) {
      console.error("Error en el callback de Microsoft:", error);
      const message = error instanceof AppError ? error.message : "Error al iniciar sesión con Microsoft";
      return res.redirect(`${envs.FRONTEND_URL}/login?error=${encodeURIComponent(message)}`);
    }
  }
}
