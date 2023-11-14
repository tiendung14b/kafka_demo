const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/orders/orders.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
})

db.run('CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, date TEXT, quantity INTEGER)')