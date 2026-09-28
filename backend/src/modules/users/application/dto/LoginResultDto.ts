export interface LoginResult {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
  };
}
