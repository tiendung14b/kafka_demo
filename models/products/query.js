const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./models/products/products.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
})

db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price INTEGER)')