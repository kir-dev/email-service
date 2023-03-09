import { createTransport, Transporter } from "nodemailer";
import { Email } from "@email-service/common";
import { config } from "./config/config";

export class MailClient {
  private transporter: Transporter | undefined;
  setupTransporter(accessToken: string, refreshToken: string) {
    this.transporter = createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        accessToken,
        user: config.FROM_EMAIL,
        clientId: config.OAUTH_CLIENT_ID,
        clientSecret: config.OAUTH_CLIENT_SECRET,
        refreshToken: refreshToken,
      },
    });
  }

  sendEmail() {
    return (email: Email) =>
      this.transporter!.sendMail({
        ...email,
        from: `${email.from || "Kir-Dev"} <${config.FROM_EMAIL}>`,
      });
  }
}
