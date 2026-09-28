export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  mobilePhone?: string;
  jobTitle?: string;
  officeLocation?: string;
  // email deliberadamente excluido: HU-03 CA-02 prohíbe editar el correo institucional
}
