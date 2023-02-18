import { Auth } from "googleapis";
import * as fs from "fs";

const tokenFileName = "token.json";

export class OauthClient {
  private readonly client: Auth.OAuth2Client;
  constructor() {
    this.client = new Auth.OAuth2Client(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    this.setupTokenListener();
    this.loadRefreshToken();
  }

  setupTokenListener() {
    this.client.on("tokens", ({ refresh_token, access_token }) => {
      console.log("Refresh Token", !!refresh_token);
      console.log("Access Token", !!access_token);
      if (refresh_token) {
        fs.writeFileSync(tokenFileName, JSON.stringify({ refresh_token }));
      }
    });
  }

  async getTokens() {
    const tokenResponse = await this.client.getAccessToken();
    const refreshToken = this.client.credentials.refresh_token;
    return { accessToken: tokenResponse.token!, refreshToken: refreshToken! };
  }

  printAuthUrl() {
    console.info(
      this.client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://mail.google.com"],
      })
    );
  }

  loadRefreshToken() {
    try {
      const tokenFile = fs.readFileSync(tokenFileName);
      const parsedTokenFile = JSON.parse(tokenFile.toString());
      this.client.setCredentials({
        refresh_token: parsedTokenFile.refresh_token,
      });
      this.client.refreshAccessToken().then(() => {
        console.info("Access Token refreshed");
      });
    } catch (e) {
      console.info("Could not parse token file, prompting login...");
      this.printAuthUrl();
    }
  }

  async exchangeCode(code: string) {
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);
  }
}
