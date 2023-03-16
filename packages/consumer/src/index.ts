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
  oauth
    .getTokens()
    .then(({ accessToken, refreshToken }) =>
      mail.setupTransporter(accessToken, refreshToken)
    )
    .catch(console.error);
  setTimeout(() => consumer.consume(mail.sendEmail()), 5000);
}

bootstrap();
