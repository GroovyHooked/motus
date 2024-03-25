class MotusGame {
    constructor(level) {
        this.initElements()
        this.initVariables(level);
        this.initEvents();
        this.displayGrid('default');
    }
    
    setLevel(level) {
        this.level = level;
    }
    
    async initElements() {
        this.messageContainer = document.querySelector('.message-container-game');
        this.resultContainer = document.querySelector('.current-score-value');
        this.bestScoreContainer = document.querySelector('.max-score-value');
        this.motusGrid = document.querySelector('.motus-grid');
        this.playButton = document.querySelector('.play-button');
        this.leaderBoardLink = document.querySelector('.leaderboard-link');
    }

    async initVariables(level) {
        this.rows = [];
        this.wordIndexesToFill = [0];
        this.randomWord;
        this.indexOfLetterTyped = 1;
        this.indexOfRowToFill = 0;
        this.delayInSeconds = 3;
        this.delayInMilliseconds = this.delayInSeconds * 1000;
        this.nbOfWordsFound = 0;
        this.isGamePlaying = false;
        this.level = level;
        try {
            this.userEmail = await this.retrieveUserEmail();
        } catch (error) {
            console.error(error);
        }
    }

    initEvents() {
        this.playButton.addEventListener('click', () => this.handlePlayButtonClick());
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handlePlayButtonClick() {
        if(!this.isGamePlaying) {
            this.nbOfWordsFound = 0;
            this.resultContainer.innerHTML = this.nbOfWordsFound;
            this.playButton.innerHTML = 'Stop';
            this.gameInit(this.level);
        } else {
            this.isGamePlaying = false;
            this.playButton.innerHTML = 'Jouer';
            this.displayMessage('Partie terminée');
            this.sendUserScore(this.userEmail, this.nbOfWordsFound).then((message) => {
                setTimeout(() => {
                    this.displayMessage(message);
                }, 3000);
            });
        }
    }

    handleKeyDown(e) {
        e.preventDefault();
        this.handleUserInput(e, this.randomWord);
    }

    gameInit(level) {
        this.retreiveBestScoreFromServer().then(({ bestScore }) => {
            bestScore === null ? bestScore = 0 : null;
            this.bestScoreContainer.innerHTML = bestScore;
            this.wordIndexesToFill = [0];
            this.indexOfLetterTyped = 1;
            this.indexOfRowToFill = 0;
        });
        this.retrieveWordFromApi(level).then((word) => {
            word = this.removeAccents(word);
            this.motusGrid.style.width = `${word?.length * 40}px`;
            this.randomWord = word;
            this.displayGrid(word);
            this.launchGame(word);
        });
    }

    launchGame(randomWord) {
        const firstRow = document.querySelectorAll('.motus-col-1');
        const secondRow = document.querySelectorAll('.motus-col-2');
        const thirdRow = document.querySelectorAll('.motus-col-3');
        const fourthRow = document.querySelectorAll('.motus-col-4');
        const fifthRow = document.querySelectorAll('.motus-col-5');
        const sixthRow = document.querySelectorAll('.motus-col-6');
        const seventhRow = document.querySelectorAll('.motus-col-7');
        this.rows = [];
        this.rows.push(firstRow, secondRow, thirdRow, fourthRow, fifthRow, sixthRow, seventhRow);

        this.rows[0].forEach((element, index) => {
            if (this.wordIndexesToFill.includes(index)) {
                element.innerHTML = randomWord[index].toUpperCase();
            } else {
                element.innerHTML = '.';
            }
            element.style.transform = 'rotate(90deg)';
            element.style.textAlign = 'center';
        });
        this.isGamePlaying = true;
        this.leaderBoardLink.classList.add('disabled-link');
    }

    handleUserInput(event, randomWord) {
        if (!this.isGamePlaying) return;
        if (event.key === "Enter" || event.key === "Backspace" || event.key.match(/^[a-zA-Z]$/i)) {
            if (event.key === "Enter") {
                this.handleEnterKey(randomWord);
            } else if (event.key === "Backspace") {
                // If the user presses the backspace key, remove the last letter 
                // and replace it with a dot unless there are no more letters to remove
                if (this.indexOfLetterTyped === 0) return;
                this.indexOfLetterTyped--;
                this.rows[this.indexOfRowToFill][this.indexOfLetterTyped] ? this.rows[this.indexOfRowToFill][this.indexOfLetterTyped].innerHTML = '.' : null;
            } else if (event.key.match(/^[a-zA-Z]$/i)) {
                // return if the word is already complete
                if (this.indexOfLetterTyped >= randomWord?.length) return;
                // If the user presses a letter key, display the letter in the grid
                this.rows[this.indexOfRowToFill][this.indexOfLetterTyped] ? this.rows[this.indexOfRowToFill][this.indexOfLetterTyped].innerHTML = event.key.toUpperCase() : null;
                this.rows[this.indexOfRowToFill][this.indexOfLetterTyped].style.transform = 'rotate(90deg)';
                this.rows[this.indexOfRowToFill][this.indexOfLetterTyped].style.textAlign = 'center';
                if (this.indexOfLetterTyped <= randomWord.length - 1) this.indexOfLetterTyped++;
            }
        } else {
            // If the user presses any other key, return
            return;
        }
    }

    returnFirstAvailableIndex(array) {
        for (let i = 0; i <= array.length; i++) {
            if (!array.includes(i)) {
                return i;
            }
        }
    }

    displayMessage(message) {
        this.messageContainer.innerHTML = message;
        const timeout = setTimeout(() => {
            this.messageContainer.innerHTML = '';
            clearTimeout(timeout);
        }, 3000);
    }

    async retrieveWordFromApi(level) {
        return new Promise((resolve) => {
            fetch('/word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    level,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        resolve(data.word);
                    } else {
                        document.querySelector('.message-container').innerHTML = 'Une erreur est survenue pendant la récupération du mot';
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    }

    async retreiveBestScoreFromServer() {
        return new Promise((resolve) => {
            fetch('/motus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.userEmail,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        resolve({ bestScore: data.bestScore });
                    } else {
                        document.querySelector('.message-container').innerHTML = data.message;
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    }

    async retrieveUserEmail() {
        return new Promise((resolve) => {
            fetch('/user-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        resolve(data.email);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    }

    async sendUserScore(email, score) {
        return new Promise((resolve, reject) => {
            fetch('/score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    score,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        resolve(`Mise à jour du meilleur score: ${data.bestScore}`);
                    } else {
                        resolve(`Meilleur score: ${data.bestScore}`);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }

    displayGrid(word) {
        while (this.motusGrid.firstChild) {
            this.motusGrid.removeChild(this.motusGrid.firstChild);
        }
        for (let i = 0; i < 7; i++) {
            let row = document.createElement('div');
            row.className = `motus-row motus-row-${i + 1}`;

            for (let y = 0; y < word?.length; y++) {
                let col = document.createElement('div');
                col.className = `motus-col motus-col-${i + 1}`;
                row.appendChild(col);
            }
            this.motusGrid.appendChild(row);
        }
    }

    removeAccents(word) {
        return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    async handleEnterKey(randomWord) {
        // return if the game is not playing
        if (this.indexOfRowToFill > 6) return;
        // If the user presses the enter key, check if the word is complete
        // and if it is, check if the word is correct
        let letters = [];
        // Create an array of the letters typed by the user
        this.rows[this.indexOfRowToFill].forEach((element) => {
            if (element.innerHTML !== '.') {
                letters.push(element.innerHTML.toLowerCase());
            }
        });
        // If the word is not complete, return
        if (letters.length < randomWord?.length) {
            this.displayMessage('Les cases vides ne sont pas autorisées');
            return;
        }

        let randomWordCopy = randomWord;
        // Check if the word is correct
        const word = letters.join('');
        const isWordValid = await this.spellCheck(word);
        if (!isWordValid) {
            this.displayMessage('Le mot n\'est pas correct');
            return;
        }

        // Replace the letters that are known by a dot
        letters.forEach((letter, index) => {
            if (this.wordIndexesToFill.includes(index)) {
                randomWordCopy = randomWordCopy.replace(letter, '.');
            }
        });
        // Compare the array of letters with the random word
        letters.forEach((letter, index) => {
            if (letter === randomWord[index]) {
                this.rows[this.indexOfRowToFill][index].style.backgroundColor = '#FB1200';
                !this.wordIndexesToFill.includes(index) ? this.wordIndexesToFill.push(index) : null;
                randomWordCopy = randomWordCopy.replace(letter, '.');
            } else if (randomWordCopy.includes(letter)) {
                this.rows[this.indexOfRowToFill][index].style.backgroundColor = '#FEE102';
                this.rows[this.indexOfRowToFill][index].style.borderRadius = '50%';
                randomWordCopy = randomWordCopy.replace(letter, '.');
            }
        });
        // If every indexes are in the array, the word is complete
        if (this.wordIndexesToFill.length === randomWord?.length) {
            this.nbOfWordsFound++;
            this.resultContainer.innerHTML = this.nbOfWordsFound;
            this.displayMessage(`Bravo! Prochain mot dans ${this.delayInSeconds} secondes`);
            const interval = setInterval(() => {
                this.delayInSeconds--;
                this.displayMessage(`Bravo! Prochain mot dans ${this.delayInSeconds} secondes`);
            }, 1000);
            const timeout = setTimeout(() => {
                this.messageContainer.innerHTML = '';
                clearInterval(interval);
                this.gameInit(this.level);
                this.delayInSeconds = 3;
                clearTimeout(timeout);
            }, this.delayInMilliseconds);
            return;
        }
        // If the word is not complete and the user can still play, display the known letters in the next row
        if (this.indexOfRowToFill !== 6) {
            this.indexOfRowToFill++;
            this.rows[this.indexOfRowToFill].forEach((element, index) => {
                if (this.wordIndexesToFill.includes(index)) {
                    element.innerHTML = randomWord[index].toUpperCase();
                } else {
                    element.innerHTML = '.';
                }
                element.style.transform = 'rotate(90deg)';
                element.style.textAlign = 'center';
            });
            this.indexOfLetterTyped = this.returnFirstAvailableIndex(this.wordIndexesToFill);
        } else {
            // If the user has reached the last row and the word is not complete, the user loses
            this.isGamePlaying = false;
            this.leaderBoardLink.classList.remove('disabled-link');
            this.playButton.removeAttribute('disabled');
            this.playButton.style.backgroundColor = '#0B65C6';
            this.displayMessage(`Partie terminée. (Mot: ${randomWord})`);
            this.sendUserScore(this.userEmail, this.nbOfWordsFound).then((message) => {
                setTimeout(() => {
                    this.displayMessage(message);
                }, 3000);
            });
            return;
        }
    }

    async spellCheck(word) {
        return new Promise((resolve, reject) => {
            fetch('/spell-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    word,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

}

const levelInput = document.querySelector('.level-input-value');

levelInput.value = 6;

let level = 6;
let motusGame = new MotusGame(level);


levelInput.addEventListener('change', (e) => {
    level = Number(e.target.value);
    motusGame.setLevel(level);
});


