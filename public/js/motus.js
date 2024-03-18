class MotusGame {
    constructor() {
        this.resultContainer = document.querySelector('.result-container');
        this.motusGrid = document.querySelector('.motus-grid');
        this.playButton = document.querySelector('.play-button');
        this.replayButton = document.querySelector('.replay-button');
        this.rows = [];
        this.wordIndexesToFill = [0];
        this.randomWord;
        this.indexOfLetterTyped = 1;
        this.indexOfRowToFill = 0;
        this.delayInSeconds = 3;
        this.delayInMilliseconds = this.delayInSeconds * 1000; // Convert seconds to milliseconds
        this.playButton.addEventListener('click', () => {
            this.gameInit('medium');
        });
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.handleUserInput(e, this.randomWord);
        });
        this.displayGrid('motuser');
    }

    gameInit(level) {
        this.retreiveWordFromServer(level).then((word) => {
            this.motusGrid.style.width = `${word.length * 40}px`;
            this.randomWord = word;
            this.wordIndexesToFill = [0];
            this.indexOfLetterTyped = 1;
            this.indexOfRowToFill = 0;
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
    }

    handleUserInput(event, randomWord) {
        if (event.key === "Enter" || event.key === "Backspace" || event.key.match(/^[a-zA-Z]$/i)) {
            if (event.key === "Enter") {
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
                if (letters.length < randomWord.length) {
                    this.displayMessage('The word is incomplete');
                    return;
                }

                let randomWordCopy = randomWord;
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
                    } else if (randomWordCopy.includes(letter)) {
                        this.rows[this.indexOfRowToFill][index].style.backgroundColor = '#FEE900';
                        randomWordCopy = randomWordCopy.replace(letter, '.');
                    }
                });
                 // If every indexes are in the array, the word is complete
                if (this.wordIndexesToFill.length === randomWord.length) {
                    this.displayMessage(`The word is complete, next word in ${this.delayInSeconds} seconds`);
                    const interval = setInterval(() => {
                        this.delayInSeconds--;
                        this.displayMessage(`The word is complete, next word in ${this.delayInSeconds} seconds`);
                    }, 1000);
                    setTimeout(() => {
                        this.resultContainer.innerHTML = '';
                        clearInterval(interval);
                        this.gameInit('medium');
                        this.delayInSeconds = 3;
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
                    this.displayMessage('You lose');
                    return;
                }
            } else if (event.key === "Backspace") {
                // If the user presses the backspace key, remove the last letter 
                // and replace it with a dot unless there are no more letters to remove
                if (this.indexOfLetterTyped === 0) return;
                this.indexOfLetterTyped--;
                this.rows[this.indexOfRowToFill][this.indexOfLetterTyped].innerHTML = '.';
            } else if (event.key.match(/^[a-zA-Z]$/i)) {
                // return if the word is already complete
                if (this.indexOfLetterTyped >= randomWord.length) return;
                // If the user presses a letter key, display the letter in the grid
                this.rows[this.indexOfRowToFill][this.indexOfLetterTyped].innerHTML = event.key.toUpperCase();
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
        this.resultContainer.innerHTML = message;
        setTimeout(() => {
            this.resultContainer.innerHTML = '';
        }, 3000);
    }

    async retreiveWordFromServer(level) {
        return new Promise((resolve) => {
            fetch('/motus', {
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
                    document.querySelector('.message-container').innerHTML = data.message;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    displayGrid(word) {
        while (this.motusGrid.firstChild) {
            this.motusGrid.removeChild(this.motusGrid.firstChild);
        }
        for (let i = 0; i < 7; i++) {
            let row = document.createElement('div');
            row.className = `motus-row motus-row-${i + 1}`;

            for (let y = 0; y < word.length; y++) {
                let col = document.createElement('div');
                col.className = `motus-col motus-col-${i+ 1}`;
                row.appendChild(col);
            }
            this.motusGrid.appendChild(row);
        }
    }
}

const motusGame = new MotusGame();

