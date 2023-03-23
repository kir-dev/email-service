import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../token";

export const authMW = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).send("Unauthorized");
  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const decoded = decodeToken(token);
    if (!decoded) return res.status(401).send("Unauthorized");

    console.info(`Authorizing ${decoded.name}`);

    if (decoded.name === "admin") {
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
