import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}
export const readRoleFromJwt = (accessToken: string): string | null => {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
    return decoded.role;
  } catch  {
    return null;
  }
};

export const readNameFromJwt = (accessToken: string): string | null => {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(accessToken);
    return decoded.sub;
  } catch  {
    return null;
  }
};