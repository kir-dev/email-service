import { ConsumerClient } from "./consumerClient";
import { OauthClient } from "./oauthClient";
import { Webserver } from "./webserver";
import { MailClient } from "./mailClient";
require("dotenv").config();

function bootstrap() {
  console.log("Starting consumer...");
  const oauth = new OauthClient();
  const consumer = new ConsumerClient();
  new Webserver(oauth);
  const mail = new MailClient();

  if (oauth.isSetupCompleted()) {
    oauth
      .getTokens()
      .then(({ accessToken, refreshToken }) => {
        mail.setupTransporter(accessToken, refreshToken);
        consumer.consume(mail.sendEmail());
      })
      .catch(console.error);
  }
}

bootstrap();
