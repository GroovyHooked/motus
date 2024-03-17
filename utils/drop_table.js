const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/motus.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the motus database.');
  });

const sql = `DROP TABLE IF EXISTS words`;

db.run(sql, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Dropped words table.');
})