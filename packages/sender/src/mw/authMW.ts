import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";

export const authMW = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).send("Unauthorized");
  const token = authHeader.replace("Bearer ", "").trim();
  try {
    if (!token) return res.status(401).send("Unauthorized");

    console.info(`Authorizing [${token}]`);

    if (config.LOGIN_TOKENS.includes(token)) {
      console.info("OK");
      return next();
    }

    console.info("Not OK");
    return res.status(401).send("Unauthorized");
  } catch (error) {
    console.error(error);
    return res.status(401).send("Unauthorized");
  }
};
