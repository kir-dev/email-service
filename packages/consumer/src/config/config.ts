import { get } from "env-var";

export const config = {
  OAUTH_CLIENT_ID: get("OAUTH_CLIENT_ID").required().asString(),
  OAUTH_CLIENT_SECRET: get("OAUTH_CLIENT_SECRET").required().asString(),
  REDIRECT_URI: get("REDIRECT_URI").required().asString(),
  FROM_EMAIL: get("FROM_EMAIL").default("test@test.com").asString(),
  OAUTH_TOKEN_FILE_NAME: get("OAUTH_TOKEN_FILE_NAME")
    .default("token.json")
    .asString(),
};
