import { get } from "env-var";
require("dotenv").config();

export const config = {
  PORT: get("PORT").default("8080").asPortNumber(),
  OAUTH_CLIENT_ID: get("OAUTH_CLIENT_ID").default("").asString(),
  OAUTH_CLIENT_SECRET: get("OAUTH_CLIENT_SECRET").default("").asString(),
  REDIRECT_URI: get("REDIRECT_URI").default("").asString(),
  FROM_EMAIL: get("FROM_EMAIL").default("test@test.com").asString(),
  OAUTH_TOKEN_FILE_NAME: get("OAUTH_TOKEN_FILE_NAME")
    .default("token.json")
    .asString(),
};
