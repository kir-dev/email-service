import { get } from "env-var";
require("dotenv").config();

export const config = {
  JWT_SECRET: get("JWT_SECRET").default("supersecret-jwt-secret").asString(),
  SENDER_PORT: get("SENDER_PORT").default(3001).asPortNumber(),
  SEND_RETRY_COUNT: get("SEND_RETRY_COUNT").default(5).asIntPositive(),
};
