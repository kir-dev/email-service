import { ConsumerClient } from "./consumerClient";

let client;

function bootstrap() {
  client = new ConsumerClient();
}

bootstrap();
