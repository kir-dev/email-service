import { SenderClient } from "./senderClient";
import express from "express";
import bodyParser from "body-parser";
import { validateMW } from "./mw/validate";
import { sendMW } from "./mw/sendMW";

const app = express();
app.use(bodyParser.json());

const senderClient = new SenderClient();

app.post("/send", validateMW(), sendMW(senderClient));

const server = app.listen(3001);

process.on("SIGINT", () => server.close());
