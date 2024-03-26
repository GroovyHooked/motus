# MOTUS

## Game description

Motus is a popular word game that originated from a French television show. The game involves guessing a word from a given set of letters. Here's a basic rundown of how the game works:

1. At the start of the game, players are given a word of a certain length, but only the first letter of the word is revealed.

2. Players then attempt to guess the word. For each letter they guess:
    - If the letter is correct and in the right position, the letter is revealed in its correct place in the word.
    - If the letter is correct but in the wrong position, the player is notified that the letter is in the word but not in the right place.
    - If the letter is not in the word at all, the player is notified that the letter is incorrect.

3. The game continues as players make new guesses based on the information revealed from their previous guesses until they either find the word or exhaust all their tries.


## App description

This is a JavaScript-based web application that includes a server-side component built with Express.js and a client-side component built with vanilla JavaScript. The application uses an SQLite database for data persistence.

## Getting Started

To get a local copy up and running, follow these steps:

1. **Clone the repository** - Clone this repository to your local machine using `git clone <repo_url>`.
2. **Navigate to the project directory** - Change to the project directory with `cd <project_name>`.
3. **Install dependencies** - Use `npm install` to install all required dependencies.
4. **Set up environment variables** - Create a `.env` file in the root folder. Add a key named `SESSION_SECRET` with a secret string for hashing passwords.
5. **Create the user table** - Run `npm run create` to create a user table in the database.
6. **Start the server** - Use `npm run start` to start the server.

## File Structure

- `server.js`: This is the main server file. It sets up the Express.js server and includes routes for handling HTTP requests.
- `public/`: This directory contains static files served by the server, including CSS stylesheets and JavaScript files for the client-side logic.
- `utils/`: This directory contains utility scripts, including database operations and word retrieval.
- `views/`: This directory contains EJS templates for rendering HTML pages on the server.
- `database/`: This directory contains the SQLite database file.
- `package.json`: This file contains metadata about the project and its dependencies.

## Key Features

- User authentication: Users can register and log in to access the application.
- Word game: Users can play MOTUS.
- Users can choose the level of difficulty
- Leaderboard: Users can view a leaderboard showing the best scores.
