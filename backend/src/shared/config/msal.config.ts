import { ConfidentialClientApplication, Configuration, LogLevel } from "@azure/msal-node";
import envs from "./environment-vars";

// Cliente confidencial de MSAL para el flujo Authorization Code (HU-01).
// Requiere una app registrada en Azure AD (Entra ID) con permiso delegado
// User.Read de Microsoft Graph y el redirect URI configurado igual a
// AZURE_REDIRECT_URI.
const msalConfig: Configuration = {
  auth: {
    clientId: envs.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${envs.AZURE_TENANT_ID}`,
    clientSecret: envs.AZURE_CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback: () => {},
      logLevel: LogLevel.Error,
      piiLoggingEnabled: false,
    },
  },
};

export const msalClient = new ConfidentialClientApplication(msalConfig);

export const MS_LOGIN_SCOPES = ["openid", "profile", "email", "User.Read"];
