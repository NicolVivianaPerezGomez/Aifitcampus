export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  programId: number;
  department?: string;      // HU-02: "asignándoles un rol y un área" -> se guarda en users.department
  officeLocation?: string;
}
