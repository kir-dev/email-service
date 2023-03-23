import { Auth } from "googleapis";
import * as fs from "fs";
import { config } from "./config/config";

const tokenFileName = config.OAUTH_TOKEN_FILE_NAME;

export class OauthClient {
  private readonly client: Auth.OAuth2Client;
  private setupCompleted = false;
  constructor() {
    this.client = new Auth.OAuth2Client(
      config.OAUTH_CLIENT_ID,
      config.OAUTH_CLIENT_SECRET,
      config.REDIRECT_URI
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

  async getTokens(): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenResponse = await this.client.getAccessToken();
    const refreshToken = this.client.credentials.refresh_token;
    if (!tokenResponse.token) throw new Error("No access token found");
    if (!refreshToken) throw new Error("No refresh token found");
    return { accessToken: tokenResponse.token, refreshToken: refreshToken };
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
      this.setupCompleted = true;
    } catch (e) {
      console.info("Could not parse token file, prompting login...");
      this.printAuthUrl();
    }
  }

  async exchangeCode(code: string) {
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);
  }

  public isSetupCompleted() {
    return this.setupCompleted;
  }
}
