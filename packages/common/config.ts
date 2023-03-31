import { get } from "env-var";
export const config = {
  MQ_EXCHANGE: get("MQ_EXCHANGE").default("email-exchange").asString(),
  MQ_QUEUE: get("MQ_QUEUE").default("email-queue").asString(),
  MQ_ROUTING_KEY: get("MQ_ROUTING_KEY").default("email").asString(),
  MQ_CONNECTION_URL: get("MQ_CONNECTION_URL")
    .default("amqp://localhost")
    .asString(),
};
