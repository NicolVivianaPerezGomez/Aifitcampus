import jwt from "jsonwebtoken";
import envs from "../config/environment-vars";

export interface JwtPayload {
  userId: number;
  email: string;
  roleId: number;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: envs.JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, envs.JWT_SECRET) as JwtPayload;
};
