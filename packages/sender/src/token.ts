import jwt from "jsonwebtoken";
import { config } from "./config/config";

type JwtTokenPayload = {
  name: string;
};

export const generateToken = (payload: JwtTokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET);
};

export const verifyToken = (token: string): JwtTokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as JwtTokenPayload;
};

export const decodeToken = (token: string): JwtTokenPayload | undefined => {
  try {
    return jwt.decode(token) as JwtTokenPayload;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
