import { NextFunction, Request, Response } from "express";
import { Email } from "@email-service/common";
import { SenderClient } from "../senderClient";
import { Static, Type } from "@sinclair/typebox";

export const EmailRequestBody = Type.Union([Email, Type.Array(Email)]);
export type EmailRequestBodyType = Static<typeof EmailRequestBody>;
export function sendMW(client: SenderClient) {
  return (
    req: Request<any, any, EmailRequestBodyType>,
    res: Response,
    _: NextFunction
  ) => {
    const emails = Array.isArray(req.body) ? req.body : [req.body];
    emails.forEach((email) => client.publish(email));

    res.json({
      message: "Email(s) were placed in the queue.",
    });
  };
}
