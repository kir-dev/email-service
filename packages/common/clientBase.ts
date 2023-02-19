import { Channel, Connection, connect } from "amqplib";
require("dotenv").config();

const MQ_EXCHANGE = process.env.MQ_EXCHANGE || "";
const MQ_QUEUE = process.env.MQ_QUEUE || "";
const MQ_ROUTING_KEY = process.env.MQ_ROUTING_KEY || "";
const MQ_CONNECTION_URL = process.env.MQ_CONNECTION_URL || "";

export class ClientBase {
  protected readonly queue = MQ_QUEUE;
  protected readonly exchange = MQ_EXCHANGE;
  protected readonly routingKey = MQ_ROUTING_KEY;
  protected connection: Connection | undefined;
  protected channel: Channel | undefined;
  constructor() {
    console.info("Starting setup...");
    console.log("Exchange", this.exchange);
    console.log("Queue", this.queue);
    this.setup()
      .then(() => {
        console.info("Setup successful!");
      })
      .catch((e) => {
        console.error("Setup failed", e);
      });
    process.on("SIGINT", () => this.connection?.close());
  }

  async setup() {
    this.connection = await connect(MQ_CONNECTION_URL);
    this.channel = await this.connection.createChannel();
    await Promise.all([
      this.channel.assertExchange(this.exchange, "direct"),
      this.channel.assertQueue(this.queue),
    ]);
    await this.channel.bindQueue(this.queue, this.exchange, "email");
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
}
