import { SenderClient } from "./senderClient";
import express from "express";
import bodyParser from "body-parser";
import { validateMW } from "./mw/validate";
import { sendMW } from "./mw/sendMW";

const app = express();
app.use(bodyParser.json());

const senderClient = new SenderClient();

app.post("/send", validateMW(), sendMW(senderClient));

app.listen(3001);
