import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const keys: Key[] = require("../../keys.json");

export function authMW() {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).send("Unauthorized");
    }
    const token = authHeader.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "unprotected"
      ) as JWTPayload;
      console.info(`Authorizing ${decoded.name}`);
      if (keys.find((k) => k.key === token)) {
        console.info("OK");
        return next();
      }
      console.info("Not OK");
      return res.status(401).send("Unauthorized");
    } catch (error) {
      return res.status(401).send("Unauthorized");
    }
  };
}

export type Key = { name: string; key: string };
export type JWTPayload = { name: string; iat: number };
