import { get } from "env-var";
require("dotenv").config();

export const config = {
  JWT_SECRET: get("JWT_SECRET").default("supersecret-jwt-secret").asString(),
};
