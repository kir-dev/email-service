import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
const keys: Key[] | undefined = require("../../keys.json");

export function authMW() {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).send("Unauthorized");
    }
    const token = authHeader.replace("Bearer ", "");
    try {
      console.log(config.JWT_SECRET);
      const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
      console.info(`Authorizing ${decoded.name}`);
      if (keys && keys.find((k) => k.key === token)) {
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
