const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/motus.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the motus database.');
  });

//const sql1 = `CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT, difficulty TEXT)`;
const sql2 = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, email TEXT, password TEXT, bestScore INTEGER)`;

db.run(sql2, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Created words table.');
    //console.log('Created users table.');
})