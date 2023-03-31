import {
  basicValidator,
  ClientBase,
  Email,
  QueuedMessage,
} from "@email-service/common";
import { ConsumeMessage } from "amqplib";

export class ConsumerClient extends ClientBase {
  public validate = basicValidator(QueuedMessage(Email));
  consume(callback: (email: Email) => Promise<void>) {
    this.channel
      ?.consume(this.queue, async (msg) => {
        if (!msg) return;
        let parsedMessage: QueuedMessage<Email> | undefined;
        try {
          parsedMessage = JSON.parse(msg.content.toString());
        } catch (e) {
          console.log(e);
          console.error("Bad message format");
          this.channel?.nack(msg, false, false);
          return;
        }
        if (!parsedMessage || !this.validate(parsedMessage)) {
          console.error("Bad message format, validation failed");
          this.channel?.nack(msg, false, false);
          return;
        }
        try {
          await callback(parsedMessage.message);
          this.channel?.ack(msg);
        } catch (e) {
          console.error("Could not send email!", e);
          this.handleFailedMailSend(msg, parsedMessage);
        }
      })
      .then(() => {
        console.info("Consuming started!");
      })
      .catch((e) => {
        console.error("Could not start consuming!", e);
      });
  }

  private handleFailedMailSend(
    msg: ConsumeMessage,
    parsedMessage: QueuedMessage<Email>
  ) {
    //Get from the queue, delete it and put it back with ttl - 1
    // If ttl is 0, we don't put it back
    this.channel?.nack(msg, false, false);
    parsedMessage.ttl--;
    if (parsedMessage.ttl > 0) {
      this.channel?.publish(
        this.exchange,
        this.routingKey,
        Buffer.from(JSON.stringify(parsedMessage)),
        {
          persistent: true,
        }
      );
    } else {
      console.error(
        parsedMessage.message.to,
        parsedMessage.message.subject,
        "could not be sent!"
      );
      //TODO: Handle dropped messages
    }
  }
}
