const resultContainer = document.querySelector('.result-container');

const motusGrid = document.querySelector('.motus-grid');

const playButton = document.querySelector('.play-button');
const replayButton = document.querySelector('.replay-button');

let rows = [];
let wordIndexesToFill = [0];
let randomWord;
let indexOfLetterTyped = 1;
let indexOfRowToFill = 0;
let delayInSeconds = 3;
let delayInMilliseconds = delayInSeconds * 1000; // Convert seconds to milliseconds

displayGrid('motuser');

playButton.addEventListener('click', () => {
    gameInit('medium')
})

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    handleUserInput(e, randomWord);
});

function gameInit(level) {
    retreiveWordFromServer(level).then((word) => {
        motusGrid.style.width = `${word.length * 40}px`;
        randomWord = word;
        wordIndexesToFill = [0];
        indexOfLetterTyped = 1;
        indexOfRowToFill = 0;
        displayGrid(word);
        launchGame(word);
    })

}


function launchGame(randomWord) {
    const firstRow = document.querySelectorAll('.motus-col-1');
    const secondRow = document.querySelectorAll('.motus-col-2');
    const thirdRow = document.querySelectorAll('.motus-col-3');
    const fourthRow = document.querySelectorAll('.motus-col-4');
    const fifthRow = document.querySelectorAll('.motus-col-5');
    const sixthRow = document.querySelectorAll('.motus-col-6');
    const seventhRow = document.querySelectorAll('.motus-col-7');
    rows = [];
    rows.push(firstRow, secondRow, thirdRow, fourthRow, fifthRow, sixthRow, seventhRow);

    rows[0].forEach((element, index) => {
        if (wordIndexesToFill.includes(index)) {
            element.innerHTML = randomWord[index].toUpperCase();
        } else {
            element.innerHTML = '.';
        }
        element.style.transform = 'rotate(90deg)';
        element.style.textAlign = 'center';
    });
}

function handleUserInput(event, randomWord) {
    if (event.key === "Enter" || event.key === "Backspace" || event.key.match(/^[a-zA-Z]$/i)) {
        if (event.key === "Enter") {
            //debugger
            if (indexOfRowToFill > 6) return
            // If the user presses the enter key, check if the word is complete
            // and if it is, check if the word is correct
            let letters = [];
            // Create an array of the letters typed by the user
            rows[indexOfRowToFill].forEach((element) => {
                if (element.innerHTML !== '.') {
                    letters.push(element.innerHTML.toLowerCase());
                }
            });
            // If there isn't a letter in each box, return
            if (letters.length < randomWord.length) {
                resultContainer.innerHTML = 'The word is incomplete';
                setTimeout(() => {
                    resultContainer.innerHTML = '';
                }, 3000);
                return;
            }

            let randomWordCopy = randomWord;
            // Replace the letters that are known by a dot
            letters.forEach((letter, index) => {
                if (wordIndexesToFill.includes(index)) {
                    randomWordCopy = randomWordCopy.replace(letter, '.');
                }
            })
            // Compare the array of letters with the random word
            letters.forEach((letter, index) => {
                if (letter === randomWord[index]) {
                    rows[indexOfRowToFill][index].style.backgroundColor = '#FB1200';
                    !wordIndexesToFill.includes(index) ? wordIndexesToFill.push(index) : null;
                } else if (randomWordCopy.includes(letter)) {
                    rows[indexOfRowToFill][index].style.backgroundColor = '#FEE900';
                    randomWordCopy = randomWordCopy.replace(letter, '.');
                }
            })
            // If every indexes are in the array, the word is complete
            if (wordIndexesToFill.length === randomWord.length) {
                resultContainer.innerHTML = `The word is complete, next word in ${delayInSeconds} seconds`;
                const interval = setInterval(() => {
                    delayInSeconds--;
                    resultContainer.innerHTML = `The word is complete, next word in ${delayInSeconds} seconds`;
                }, 1000);
                setTimeout(() => {
                    resultContainer.innerHTML = '';
                    clearInterval(interval);
                    gameInit('medium');
                    delayInSeconds = 3;
                }, delayInMilliseconds);
                return
            }
            // If the word is not complete and the user can still play, display the known letters in the next row
            if (indexOfRowToFill !== 6) {
                indexOfRowToFill++
                rows[indexOfRowToFill].forEach((element, index) => {
                    if (wordIndexesToFill.includes(index)) {
                        element.innerHTML = randomWord[index].toUpperCase();
                    } else {
                        element.innerHTML = '.';
                    }
                    element.style.transform = 'rotate(90deg)';
                    element.style.textAlign = 'center';
                });
                indexOfLetterTyped = returnFirstAvailableIndex(wordIndexesToFill)
            } else {
                resultContainer.innerHTML = 'You loose';
                setTimeout(() => {
                    resultContainer.innerHTML = '';
                }, 3000);
                return
            }
        } else if (event.key === "Backspace") {
            // If the user presses the backspace key, remove the last letter 
            // and replace it with a dot unless there are no more letters to remove
            if (indexOfLetterTyped === 0) return;
            indexOfLetterTyped--
            rows[indexOfRowToFill][indexOfLetterTyped].innerHTML = '.';

        } else if (event.key.match(/^[a-zA-Z]$/i)) {
            if (indexOfLetterTyped >= randomWord.length) {
                // return if the word is already complete
                return;
            }
            rows[indexOfRowToFill][indexOfLetterTyped].innerHTML = event.key.toUpperCase();
            rows[indexOfRowToFill][indexOfLetterTyped].style.transform = 'rotate(90deg)';
            rows[indexOfRowToFill][indexOfLetterTyped].style.textAlign = 'center';

            if (indexOfLetterTyped <= randomWord.length - 1) indexOfLetterTyped++;
        }
    } else {
        // If the user presses any other key, return
        return;
    }
}

function returnFirstAvailableIndex(array) {
    for (let i = 0; i <= array.length; i++) {
        if (!array.includes(i)) {
            return i;
        }
    }
}

function displayMessage(message) {
    resultContainer.innerHTML = message;
    setTimeout(() => {
        resultContainer.innerHTML = '';
    }, 3000);
}

async function retreiveWordFromServer(level) {
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
                    resolve(data.word)
                } else {
                    document.querySelector('.message-container').innerHTML = data.message;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    })
}

function displayGrid(word) {
    while (motusGrid.firstChild) {
        motusGrid.removeChild(motusGrid.firstChild);
    }
    for (let i = 0; i < 7; i++) {
        let row = document.createElement('div');
        row.className = `motus-row motus-row-${i + 1}`;

        for (let y = 0; y < word.length; y++) {
            let col = document.createElement('div');
            col.className = `motus-col motus-col-${i + 1}`;

            row.appendChild(col);
        }
        motusGrid.appendChild(row);
    }
}