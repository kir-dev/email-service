import { NextFunction, Request, Response } from "express";
import { Email } from "@email-service/common";

export function validateMW() {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as Partial<Email>;
    if (body.to && body.text && body.subject) {
      res.locals.payload = body;
      return next();
    }
    return next("Body does not include some of the required keys.");
  };
}
