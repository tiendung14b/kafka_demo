const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/orders/orders.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
})

exports.getAllOrders = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM orders`, (err, rows) => {
      if (err) {
        reject(err)
      }
      resolve(rows)
    })
  })
}

exports.getOrderById = (id) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM orders WHERE id = ${id}`, (err, rows) => {
      if (err) {
        reject(err)
      }
      resolve(rows)
    })
  })
}

exports.createOrder = (product_id, date, quantity) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO orders (product_id, date, quantity) VALUES (${product_id}, '${date}', '${quantity}')`, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}