# Microservice based robust HTML Email Sender solution

This repository is an example of how a [microservice](https://en.wikipedia.org/wiki/Microservices) architecture can be implemented.
It's a simple solution with a single endpoint that expect an HTML email which will be sent to a list of recipients.

## Development

To start the development environment, you need to have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

#### To start the RabbitMQ service:

RabbitMQ admin: [localhost:15672](localhost:15672) (user: guest pass: guest)

```bash
docker-compose up -d rabbitmq
```

#### To start the services

Start the sender and receiver services concurrently:

```bash
yarn dev
```

## The architecture

```mermaid
    flowchart LR
    A(((Send\nRequest))) --> B[Sender]
    B --> C[RabitMQ]
    C --> D[Receiver]
    D --> E(((Clients)))
```

### The sender

The sender is a simple [Node.js](https://nodejs.org/en/) application that expose a single endpoint `/send` which expect a JSON body with the following structure:

```json
{
  "to": "example@example.com",
  "from": "My App",
  "subject": "Example Email",
  "text": "Plain text if you don't need HTML",
  "html": "<h1>Syntactically correct HTML code<h2>"
}
```

Make a `POST` request to `/send` route with an object or an array of objects defined above to place the emails onto the queue.

See the sender [README](packages/sender/README.md) for more details.

### RabbitMQ

[RabbitMQ](https://www.rabbitmq.com/) is a message broker that will be used to queue the emails to be sent. It's a very simple and fast solution to implement a queue system.
This ensures that failing services will not affect the email sending process. 

If a service dies or is overloaded, the emails will be queued and sent when the service is back online.

### The receiver

The receiver is a simple [Node.js](https://nodejs.org/en/) application that will consume the messages from the queue and send the emails with [Nodemailer](https://nodemailer.com/about/).

If the email sending fails, the message will be requeued and retried until it succeeds, or reaches a predefined resend TTL counter, after which it will be discarded. 

See the receiver [README](packages/receiver/README.md) for more details.