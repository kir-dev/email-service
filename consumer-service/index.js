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

ch.consume(queue, (msg) => {
  if (msg !== null) {
    const email = JSON.parse(msg.content)
    if (email.to && email.subject && email.content) {
      console.log(
        `Should be sending an email by ${msg.properties.userId} to ${email.to} with subject ${email.subject} and content ${email.content}`
      )
      ch.ack(msg)
    } else {
      ch.nack(msg)
    }
  } else {
    console.log("Consumer cancelled by server")
  }
})
