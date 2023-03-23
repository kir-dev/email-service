import { ClientBase, Email, QueuedMessage } from "@email-service/common";

export class SenderClient extends ClientBase {
  publish(email: QueuedMessage<Email>) {
    this.channel?.publish(
      this.exchange,
      this.routingKey,
      Buffer.from(JSON.stringify(email))
    );
  }
}
