import { SenderClient } from "./senderClient";
import express from "express";
import bodyParser from "body-parser";
import { EmailRequestBody, sendMW } from "./mw/sendMW";
import { authMW } from "./mw/authMW";
import { loginMW } from "./mw/loginMW";
import { config } from "./config/config";
import { validateRequest } from "@email-service/common";

const app = express();
app.use(bodyParser.json());

const senderClient = new SenderClient();

app.post("/login", loginMW);
app.post(
  "/send",
  authMW,
  validateRequest({
    body: EmailRequestBody,
  }),
  sendMW(senderClient)
);

const server = app.listen(config.SENDER_PORT);
console.log(`Sender listening on port ${config.SENDER_PORT}!`);

process.on("SIGINT", () => server.close());
