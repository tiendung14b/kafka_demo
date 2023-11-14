const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/carts/carts.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
})

exports.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM carts`, (err, rows) => {
      if (err) {
        reject(err)
      }
      resolve(rows)
    })
  })
}

exports.addProduct = (product_id, quantity) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO carts (product_id, quantity) VALUES (${product_id}, ${quantity})`, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

exports.removeProduct = (product_id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM carts WHERE product_id = ${product_id}`, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}