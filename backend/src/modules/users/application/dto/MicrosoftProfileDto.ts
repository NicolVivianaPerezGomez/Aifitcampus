// Perfil normalizado que llega desde Microsoft Graph tras el login OAuth (HU-01)
export interface MicrosoftProfileDto {
  microsoftId: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string | null;
  department: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  businessPhones: string | null;
}
