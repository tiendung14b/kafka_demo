const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/products/products.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
})

exports.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM products`, (err, rows) => {
      if (err) {
        reject(err)
      }
      resolve(rows)
    })
  })
}

exports.getProductById = (id) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM products WHERE id = ${id}`, (err, rows) => {
      if (err) {
        reject(err)
      }
      resolve(rows)
    })
  })
}

exports.createProduct = (name, price) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO products (name, price) VALUES ('${name}', ${price})`, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}