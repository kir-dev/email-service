import { ClientBase, Email } from "@email-service/common";

export class ConsumerClient extends ClientBase {
  consume(callback: (email: Email) => Promise<void>) {
    this.channel
      ?.consume(this.queue, (msg) => {
        if (!msg) return;
        let parsedMessage: Email | undefined;
        try {
          parsedMessage = JSON.parse(msg.content.toString());
        } catch (e) {
          console.log(e);
          console.error("Bad message format");
        }
        if (!parsedMessage) {
          console.log("Parsed message is empty");
          return;
        }
        callback({
          subject: parsedMessage.subject,
          text: parsedMessage.text,
          to: parsedMessage.to,
        }).then(() => {
          this.channel?.ack(msg);
        });
      })
      .then(() => {
        console.info("Consuming started!");
      })
      .catch((e) => {
        console.error("Could not start consuming!", e);
      });
  }
}
