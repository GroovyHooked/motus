const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/motus.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the motus database.');
});

function insertWords(value, difficulty) {
    sql = `INSERT INTO words (value, difficulty) VALUES (?, ?)`;
    db.run(sql, [value, difficulty], (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Inserted crypto data.');
    })
}

insertWords('chat', 'easy');
insertWords('bleu', 'easy');
insertWords('maison', 'easy');
insertWords('soleil', 'easy');
insertWords('ecologie', 'medium');
insertWords('harmonie', 'medium');
insertWords('guitare', 'medium');
insertWords('cascade', 'medium');
insertWords('psychologie', 'hard');
insertWords('exponentiel', 'hard');
insertWords('mythologie', 'hard');
insertWords('incommensurable', 'hard');