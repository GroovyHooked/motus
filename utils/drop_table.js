const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/motus.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the motus database.');
  });

//const sql1 = `DROP TABLE IF EXISTS words`;
const sql2 = `DROP TABLE IF EXISTS users`;

db.run(sql2, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Dropped words table.');
    //console.log('Dropped users table.');
})