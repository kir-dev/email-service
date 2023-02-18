import { ConsumerClient } from "./consumerClient";

let client;

function bootstrap() {
  client = new ConsumerClient();
  client.consume(console.log);
}

bootstrap();
