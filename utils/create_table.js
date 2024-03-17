const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/motus.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the motus database.');
  });

const sql = `CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT, difficulty TEXT)`;

db.run(sql, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Created crypto table.');
})