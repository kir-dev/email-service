import { NextFunction, Request, Response } from "express";
import { Email } from "@email-service/common";
import { SenderClient } from "../senderClient";

export function sendMW(client: SenderClient) {
  return (req: Request, res: Response, _: NextFunction) => {
    const data = res.locals.payload as Email[];
    data.forEach((email) => {
      client.publish(email);
    });
    res.send();
  };
}
