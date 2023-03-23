import { basicValidator, ClientBase, Email } from "@email-service/common";

export class ConsumerClient extends ClientBase {
  public validate = basicValidator(Email);
  consume(callback: (email: Email) => Promise<void>) {
    this.channel
      ?.consume(this.queue, async (msg) => {
        if (!msg) return;
        let parsedMessage: Email | undefined;
        try {
          parsedMessage = JSON.parse(msg.content.toString());
        } catch (e) {
          console.log(e);
          console.error("Bad message format");
          return;
        }
        if (!parsedMessage || !this.validate(parsedMessage)) {
          console.error("Bad message format");
          return;
        }
        try {
          await callback(parsedMessage);
          this.channel?.ack(msg);
        } catch (e) {
          console.error("Could not send email!", e);
          this.channel?.nack(msg);
        }
      })
      .then(() => {
        console.info("Consuming started!");
      })
      .catch((e) => {
        console.error("Could not start consuming!", e);
      });
  }
}
