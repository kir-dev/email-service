import { ClientBase, Email } from "@email-service/common";

export class SenderClient extends ClientBase {
  publish(email: Email) {
    this.channel?.publish(
      this.exchange,
      "email",
      Buffer.from(JSON.stringify(email))
    );
  }
}
