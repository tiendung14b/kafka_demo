const { Kafka } = require('kafkajs')
const productDb = require('./models/products/db')

class ViewProduct {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'view_product',
      brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
    })
    this.consumer = this.kafka.consumer({ groupId: 'view_product' })
    const errorTypes = ['unhandledRejection', 'uncaughtException']
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']
    errorTypes.map(type => {
      process.on(type, async e => {
        try {
          console.log(`process.on ${type}`)
          console.error(e)
          await this.consumer.disconnect()
          process.exit(0)
        } catch (_) {
          process.exit(1)
        }
      })
    })
    signalTraps.map(type => {
      process.once(type, async () => {
        try {
          await this.consumer.disconnect()
        } finally {
          process.kill(process.pid, type)
        }
      })
    })
  }

  async run() {
    try {
      await this.consumer.connect()
      await this.consumer.subscribe({ topic: 'view_product' })
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            console.log({
              topic: topic,
              partition,
              offset: message.offset,
              value: message.value.toString(),
            })
            if (message.value.type == 'view_all_product') {
              const products = await productDb.getAllProduct()
              message.value.res.json(products)
            } else if (message.value.type == 'view_product') {
              const product = await productDb.getProduct(message.value.data.id)
              message.value.res.json(product)
            }
          } catch (err) {
            err.filename = 'view_product.js'
            err.line = 57
            console.error(err)
          } 
        }
      })
    } catch (err) {
      err.filename = 'view_product.js'
      err.line = 64
      console.error(err)
    }
  } 
}

module.exports = ViewProduct