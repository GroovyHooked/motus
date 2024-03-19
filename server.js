const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');

const { selectRandomWord, insertUser, retrieveUser } = require('./utils/database.js')
const { comparePassword, isPasswordValid } = require('./utils/password.js')

const app = express()
const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Set ejs as the view engine
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.redirect('/login');
})

// Login page
app.get('/login', async function (req, res) {
  const email = req.query.data;
  if (email) {
    return res.render(__dirname + '/views/login', { message: '', email: email});
  }
  res.render(__dirname + '/views/login', { message: '', email: ''});
});

app.post('/login', async function (req, res) {
  const { email, password } = req.body;
  console.log(email, password);
  retrieveUser(email).then((user) => {
    if (user) {
      comparePassword(password, user.password).then((match) => {
        if (match) {
          return res.json({ success: true, email: email});
        } else {
          return res.json({ success: false, message: 'Invalid password'});
        }
      }).catch((error) => {
        console.error(error);
        return res.json({ success: false, message: 'An error occurred while comparing passwords'});
      });
    } else {
      return res.json({ success: false, message: 'Invalid email'});
    }
  }).catch((error) => {
    console.error(error);
    return res.json({ success: false, message: 'An error occurred while retrieving user'});
  });
});

// Signup page
app.get('/signup', (req, res) => {
  res.render(__dirname + '/views/signup', { message: '' });
});

app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  insertUser(firstName, lastName, email, password);
  return res.json({ success: true, message: email });
});


// Game page
app.get('/motus', async function (req, res) {
  res.render(__dirname + '/views/motus');
});

app.post('/motus', async (req, res) => {
  const { level } = req.body;
  const word = await selectRandomWord(level);
  res.json({ success: true, level: level, word: word});
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
