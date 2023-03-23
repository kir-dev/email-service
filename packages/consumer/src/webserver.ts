import { OauthClient } from "./oauthClient";
import { createServer, RequestListener, Server } from "http";
import { parse } from "url";
import { config } from "./config/config";

export class Webserver {
  private readonly oauthClient: OauthClient;
  private readonly server: Server;

  private readonly listener: RequestListener = (req, res) => {
    res.writeHead(200);
    res.end("You may close this window now!");
    try {
      const query = parse(req.url!, true).query;
      const code = query.code;
      if (code && !Array.isArray(code))
        this.oauthClient.exchangeCode(code).then(() => {
          console.log("Successfully exchanged code!");
        });
    } catch (e) {
      console.error("Failed to get query params!");
    }
  };

  constructor(oauthClient: OauthClient) {
    this.oauthClient = oauthClient;
    this.server = createServer(this.listener);
    this.open();
  }

  open() {
    this.server.listen(config.PORT);
    console.log(`Listening on port ${config.PORT}`);
    process.on("SIGINT", () => this.server.close());
  }
}
