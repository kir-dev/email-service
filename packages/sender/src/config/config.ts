import { get } from "env-var";

export const config = {
  JWT_SECRET: get("JWT_SECRET").default("supersecret-jwt-secret").asString(),
};
