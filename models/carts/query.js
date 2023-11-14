const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./models/carts/carts.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
})

db.run('CREATE TABLE IF NOT EXISTS carts (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, quantity INTEGER)')