import { NextFunction, Request, Response } from "express";
import { generateToken } from "../token";

export const loginMW = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    res.status(200).json({
      token: generateToken({
        name: "admin",
      }),
    });
  } else {
    res.status(401).send("Login failed");
  }
};
