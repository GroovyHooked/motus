require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const {
  insertUser,
  retrieveUser,
  updateUserBestScore,
  getUserBestScore,
  retreiveBestScores,
  retreiveUserName
} = require('./utils/database.js')
const { comparePassword } = require('./utils/password.js')
const { getWord } = require('./utils/get_word.js')
const { SpellChecker } = require('./utils/spell_check.js')


const app = express()
const port = 3000

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: app.get('env') === 'production'
  }
}
app.use(session(sess));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set ejs as the view engine
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.redirect('/login');
})

// Login page
app.get('/login', async function (req, res) {
  const email = req.query.data || '';
  res.render(__dirname + '/views/login', { message: '', email: email });
});

app.post('/login', async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await retrieveUser(email);
    if (!user) {
      return res.json({ success: false, message: 'L\'utilisateur n\'est pas inscrit' });
    }
    const match = await comparePassword(password, user.password);
    if (match) {
      req.session.user = { email: email };
      return res.json({ success: true, email: email });
    } else {
      return res.json({ success: false, message: 'Mot de passe incorrect' });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Une erreur est survenue lors de la vérification de validité du mot de passe.' });
  }
});

// Signup page
app.get('/signup', (req, res) => {
  res.render(__dirname + '/views/signup', { message: '' });
});

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await retrieveUser(email);
    if (user) {
      return res.json({ success: false, message: 'Cette adresse mail est déjà utilisée' });
    } else {
      insertUser(firstName, lastName, email, password);
      return res.json({ success: true, message: email });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: 'Une erreur est survenue pendant la vérification de l\'adresse mail' });
  }
});


// Game page
app.get('/motus', async function (req, res) {
  const userEmail = req.session.user?.email;
  if (!userEmail) {
    return res.redirect('/login');
  }
  const userName = await retreiveUserName(userEmail);
  res.render(__dirname + '/views/motus', { userName: userName, page: 'game' });
});

app.post('/motus', async (req, res) => {
  const { email } = req.body;
  const bestScore = await getUserBestScore(email);
  res.json({ success: true, bestScore: bestScore });
});

// data endpoint
app.post('/score', async (req, res) => {
  const { email, score } = req.body;
  const bestScore = await getUserBestScore(email);
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

// data endpoint
app.post('/word', async (req, res) => {
  const level = req.body.level;
  try {
    const word = await getWord(level);
    res.json({ success: true, word: word });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
})

// data endpoint
app.post('/spell-check', async (req, res) => {
  const { word } = req.body;
  const spellChecker = new SpellChecker('./utils/dico.txt');
  if (spellChecker.checkSpelling(word)) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});


// Leaderboard page
app.get('/leaderboard', async function (req, res) {
  const userEmail = req.session.user?.email;
  if (!userEmail) {
    return res.redirect('/login');
  }
  const bestScores = await retreiveBestScores();
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
