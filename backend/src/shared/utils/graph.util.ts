import { MicrosoftProfileDto } from "../../modules/users/application/dto/MicrosoftProfileDto";
import { AppError } from "./AppError";

// Perfil crudo devuelto por Microsoft Graph (GET /me). Se documentan solo los
// campos que efectivamente usamos, todos ya contemplados en el diccionario
// como "extraídos de Azure AD".
interface GraphMeResponse {
  id: string;
  mail: string | null;
  userPrincipalName: string;
  givenName: string | null;
  surname: string | null;
  jobTitle: string | null;
  department: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  businessPhones: string[];
}

export const fetchMicrosoftProfile = async (accessToken: string): Promise<MicrosoftProfileDto> => {
  const response = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new AppError("No fue posible obtener el perfil de Microsoft 365", 502);
  }

  const profile = (await response.json()) as GraphMeResponse;

  return {
    microsoftId: profile.id,
    email: (profile.mail ?? profile.userPrincipalName).toLowerCase(),
    firstName: profile.givenName ?? "",
    lastName: profile.surname ?? "",
    jobTitle: profile.jobTitle,
    department: profile.department,
    officeLocation: profile.officeLocation,
    mobilePhone: profile.mobilePhone,
    businessPhones: profile.businessPhones?.length ? JSON.stringify(profile.businessPhones) : null,
  };
};
