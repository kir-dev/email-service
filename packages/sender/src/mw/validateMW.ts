import { NextFunction, Request, Response } from "express";
import { Email } from "@email-service/common";

export function validateMW() {
  return (req: Request, res: Response, next: NextFunction) => {
    let body = req.body;
    if (!Array.isArray(body)) {
      body = [body];
    }
    const sanitizedEmails: Email[] = [];
    for (let email of body) {
      const sanitizedEmail: Partial<Email> = {};
      for (let key of emailKeys) {
        if (requiredKeys.includes(key) && !email[key])
          return res
            .status(400)
            .send(
              "Some of the required filed are not present in one or more obejcts."
            );

        sanitizedEmail[key] = email[key] || "";
      }
      sanitizedEmails.push(sanitizedEmail as Email);
    }
    res.locals.payload = sanitizedEmails;
    return next();
  };
}

const emailKeys: (keyof Email)[] = ["subject", "text", "html", "to", "from"];
const requiredKeys: (keyof Email)[] = ["subject", "to"];
