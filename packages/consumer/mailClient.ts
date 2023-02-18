import { createTransport, Transporter } from "nodemailer";
import { Email } from "@email-service/common";

export class MailClient {
  private transporter: Transporter | undefined;
  setupTransporter(accessToken: string, refreshToken: string) {
    this.transporter = createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        accessToken,
        user: process.env.FROM_EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: refreshToken,
      },
    });
  }

  sendEmail() {
    return (email: Email) =>
      this.transporter!.sendMail({ ...email, from: process.env.FROM_EMAIL });
  }
}
