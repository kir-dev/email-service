import { ConsumeMessage } from "amqplib";
import { ClientBase } from "@email-service/common";

export class ConsumerClient extends ClientBase {
  consume(callback: (message: ConsumeMessage) => void) {
    this.channel
      ?.consume(this.queue, (msg) => {
        if (msg) callback(msg);
      })
      .then(() => {
        console.info("Consuming started!");
      })
      .catch((e) => {
        console.error("Could not start consuming!", e);
      });
  }
}
