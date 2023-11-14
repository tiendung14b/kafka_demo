const app = require('express')()
const bodyParser = require('body-parser')
const { Kafka } = require('kafkajs')
const listConsumer = []
const view_product = require('./view_product')
const addProductConsumer = new (require('./add_product'))()
const addOrderConsumer = new (require('./add_order'))()
const cors = require('cors')

app.use(cors({origin: '*'}))


app.use(bodyParser.json())  

app.post('/add_product', async (req, res) => {
  const kafka = new Kafka({
    clientId: 'order',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
  })
  try {
    const producer = kafka.producer()
    await producer.connect()
    await producer.send({
      topic: 'add-product',
      messages: [
        { value: JSON.stringify(req.body) },
      ],
    })
    res.json({ status: 'ok' })
    await producer.disconnect()
  } catch (err) {
    console.error(err)
  }
})

app.post('/add_order', async (req, res) => {
  const kafka = new Kafka({
    clientId: 'order',
    brokers: ['localhost:9094']
  })
  try {
    const producer = kafka.producer()
    await producer.connect()
    await producer.send({
      topic: 'add-orders',
      messages: [
        { value: JSON.stringify(req.body) },
      ],
    })
    res.json({ status: 'ok' })
    await producer.disconnect()
  } catch (err) {
    console.error(err)
  }
})

app.get('/list_product', async (req, res) => {
  const kafka = new Kafka({
    clientId: 'order',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
  })
  try {
    const consumer = kafka.consumer({ groupId: 'test_list_product' })
    await consumer.connect()
    await consumer.subscribe({ topic: 'test-list-product' })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log({
            topic: topic,
            partition,
            offset: message.offset,
            value: message.value.toString(),
          })
          const data = JSON.parse(message.value.toString())
          res.json(data)
        } catch (err) {
          err.filename = 'index.js'
          err.line = 117
          console.error(err)
        }
      },
    })
    listConsumer.push(consumer)
  } catch (err) {
    err.filename = 'index.js'
    err.line = 123
    console.error(err)
  }
})


addProductConsumer.run()
addOrderConsumer.run()

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

// errorTypes.map(type => {
//   process.on(type, async e => {
//     try {
//       console.log(`process.on ${type}`)
//       console.error(e)
//       await consumer.disconnect()
//       process.exit(0)
//     } catch (_) {
//       process.exit(1)
//     }
//   })
// })

// signalTraps.map(type => {
//   process.once(type, async () => {
//     try {
//       await consumer.disconnect()
//     } finally {
//       process.kill(process.pid, type)
//     }
//   })
// })

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
})
