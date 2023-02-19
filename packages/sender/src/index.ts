import { SenderClient } from "./senderClient";
import express from "express";
import bodyParser from "body-parser";
import { validateMW } from "./mw/validateMW";
import { sendMW } from "./mw/sendMW";
import { authMW } from "./mw/authMW";
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const senderClient = new SenderClient();

app.post("/send", authMW(), validateMW(), sendMW(senderClient));

const server = app.listen(3001);

process.on("SIGINT", () => server.close());
