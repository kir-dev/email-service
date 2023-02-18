import { ClientBase } from "@email-service/common";

export class SenderClient extends ClientBase {
  publish(message: string) {
    this.channel?.publish(this.exchange, "email", Buffer.from(message));
  }
}
