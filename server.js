require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const {
  selectRandomWord,
  insertUser,
  retrieveUser,
  updateUserBestScore,
  getUserBestScore,
  retreiveBestScores,
  retreiveUserName
} = require('./utils/database.js')
const { comparePassword } = require('./utils/password.js')

const app = express()
const port = 3000

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

console.log(app.get('env'));
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
    return res.render(__dirname + '/views/login', { message: '', email: email });
  }
  res.render(__dirname + '/views/login', { message: '', email: '' });
});

app.post('/login', async function (req, res) {
  debugger
  const { email, password } = req.body;
  console.log(email, password);
  retrieveUser(email).then((user) => {
    if (user) {
      comparePassword(password, user.password).then((match) => {
        if (match) {
          console.log('Password is correct');
          req.session.user = { email: email };
          return res.json({ success: true, email: email });
        } else {
          return res.json({ success: false, message: 'Mot de passe incorrect' });
        }
      }).catch((error) => {
        console.error(error);
        return res.json({ success: false, message: 'Une erreur est survenue lors de la verification de validité du mot de passe.' });
      });
    } else {
      return res.json({ success: false, message: 'Email non valide' });
    }
  }).catch((error) => {
    console.error(error);
    return res.json({ success: false, message: 'Une erreur est survenue lors du chargement de l\'utilisateur.' });
  });
});

// Signup page
app.get('/signup', (req, res) => {
  res.render(__dirname + '/views/signup', { message: '' });
});

app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  retrieveUser(email).then((user) => {
    if (user) {
      return res.json({ success: false, message: 'Cette adresse mail est déjà utilisée' });
    } else {
      insertUser(firstName, lastName, email, password);
      return res.json({ success: true, message: email });
    }
  }).catch((error) => {
    console.error(error);
    return res.json({ success: false, message: 'Une erreur est survenue pendant la verification de l\'adresse mail' });
  });
});


// Game page
app.get('/motus', async function (req, res) {
  console.log({ session: req.session.user });
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    const userEmail = req.session.user?.email;
    const userName = await retreiveUserName(userEmail);

    res.render(__dirname + '/views/motus', { userName: userName, page: 'game' });
  }
});

app.post('/motus', async (req, res) => {
  const { level, email } = req.body;
  const word = await selectRandomWord(level);
  const bestScore = await getUserBestScore(email);
  res.json({ success: true, level: level, word: word, bestScore: bestScore });
});

// data endpoint
app.post('/score', async (req, res) => {
  const { email, score } = req.body;
  const bestScore = await getUserBestScore(email);
  console.log({ email, score, bestScore });
  if (score > bestScore) {
    updateUserBestScore(email, score);
    res.json({ success: true, bestScore: score });
  } else {
    res.json({ success: false, bestScore: bestScore });
  }
});

// data endpoint
app.post('/user-data', async (req, res) => {
  const email = req.session.user?.email;
  res.json({ success: true, email: email });
});

// Leaderboard page
app.get('/leaderboard', async function (req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const bestScores = await retreiveBestScores();
  const userEmail = req.session.user.email;
  const userName = await retreiveUserName(userEmail);
  res.render(__dirname + '/views/leaderboard', { bestScores: bestScores, userName: userName, page: 'leaderboard' });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
