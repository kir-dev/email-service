import { Channel, Connection, connect } from "amqplib";

const exchange = "email_exchange";
const queue = "email_queue";

export class SenderClient {
  private connection: Connection | undefined;
  private channel: Channel | undefined;
  constructor() {
    console.info("Starting setup...");
    console.log("Exchange", exchange);
    console.log("Queue", queue);
    this.setup()
      .then(() => {
        console.info("Setup successful!");
        this.publish("Hello world");
      })
      .catch((e) => {
        console.error("Setup failed", e);
      });
  }

  async setup() {
    this.connection = await connect("amqp://localhost");
    this.channel = await this.connection.createChannel();
    await Promise.all([
      this.channel.assertExchange(exchange, "direct"),
      this.channel.assertQueue(queue),
    ]);
    await this.channel.bindQueue(queue, exchange, "email");
    this.channel.on("close", () => {
      console.warn("Channel closed!");
    });
    this.channel.on("error", (e) => {
      console.error("Channel error", e);
    });
    this.channel.on("blocked", (reason) => {
      console.warn("Channel blocked", reason);
    });
    this.channel.on("unblocked", () => {
      console.info("Channel unblocked!");
    });
  }

  publish(message: string) {
    this.channel?.publish(exchange, "email", Buffer.from(message));
  }
}
