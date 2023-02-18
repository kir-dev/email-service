import amqplib from "amqplib"

const exchange = "email"
const queue = "email"
const conn = await amqplib.connect("amqp://localhost")

const ch = await conn.createChannel()
await Promise.all([
  ch.assertExchange(exchange, "direct"),
  ch.assertQueue(queue),
])
await ch.bindQueue(queue, exchange, "email")

setInterval(() => {
  ch.publish(
    exchange,
    "email",
    Buffer.from(
      JSON.stringify({
        to: "example@example.com",
        subject: "A very interesting email",
        content: "Hey Example! I hope you're having a great day!",
      })
    ),
    { userId: "konzisite" }
  )
}, 1000)
