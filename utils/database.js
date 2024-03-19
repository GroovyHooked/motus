const sqlite3 = require('sqlite3').verbose();
const { hashPassword } = require('./password.js')

const db = new sqlite3.Database('./database/motus.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the motus database.');
});

async function getUserBestScore(email) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT bestScore FROM users WHERE email = ?`;
        db.all(sql, [email], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows[0].bestScore);
            }
        });
    });
}

async function updateUserBestScore(email, score) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET bestScore = ? WHERE email = ?`;
        db.run(sql, [score, email], (err) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function selectRandomWord(difficulty) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT value FROM words WHERE difficulty = '${difficulty}' ORDER BY RANDOM() LIMIT 1;`;
        db.all(sql, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows[0].value);
            }
        });
    });
}

async function insertUser(firstname, lastname, email, password) {
    password = await hashPassword(password);
    const sql = `INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)`;

    db.run(sql, [firstname, lastname, email, password], (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('User Inserted.');
    })
}

function retrieveUser(email) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        db.all(sql, [email], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    });
}

module.exports = { selectRandomWord, insertUser, retrieveUser, updateUserBestScore, getUserBestScore};


