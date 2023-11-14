const { Kafka } = require('kafkajs')
const productDb = require('./models/products/db')
const fs = require('fs')

class AddProduct {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'add_product',
      brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
    })
  }

  clearConsumer(consumer) {
    const errorTypes = ['unhandledRejection', 'uncaughtException']
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']
    errorTypes.map(type => {
      process.on(type, async e => {
        try {
          console.log(`process.on ${type}`)
          console.error(e)
          await consumer.disconnect()
          process.exit(0)
        } catch (_) {
          process.exit(1)
        }
      })
    })
    signalTraps.map(type => {
      process.once(type, async () => {
        try {
          await consumer.disconnect()
        } finally {
          process.kill(process.pid, type)
        }
      })
    })
  }

  async run() {
    try {
      const consumer = this.kafka.consumer({ groupId: 'add_product' })
      await consumer.connect()
      await consumer.subscribe({ topic: 'add-product' })
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
            await productDb.createProduct(data.name, data.price).then(() => {
              fs.appendFile('add_product.log', 'Product created at ' + topic + ' ' + partition + ' ' + message.offset + ' time: ' + Date.now().toString() + '\n', (err) => {
                if (err) throw err
                console.log('The file has been saved!')
              })
            }).catch((err) => {
              console.error(err)
            })
          } catch (err) {
            err.filename = 'add_product.js'
            err.line = 57
            console.error(err)
          }
        }
      })
      this.clearConsumer(consumer)
    } catch (err) { 
      err.filename = 'add_product.js'
      err.line = 63
      console.error(err)
    }
  } 
}

module.exports = AddProduct