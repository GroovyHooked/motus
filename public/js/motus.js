randomWord = randomWord.toLowerCase();

const resultContainer = document.querySelector('.result-container');

const firstRow = document.querySelectorAll('.motus-col-1');
const secondRow = document.querySelectorAll('.motus-col-2');
const thirdRow = document.querySelectorAll('.motus-col-3');
const fourthRow = document.querySelectorAll('.motus-col-4');
const fifthRow = document.querySelectorAll('.motus-col-5');
const sixthRow = document.querySelectorAll('.motus-col-6');
const seventhRow = document.querySelectorAll('.motus-col-7');


const rows = [firstRow, secondRow, thirdRow, fourthRow, fifthRow, sixthRow, seventhRow];
const wordIndexesToFill = [0];

rows[0].forEach((element, index) => {
    if (wordIndexesToFill.includes(index)) {
        element.innerHTML = randomWord[index].toUpperCase();
    } else {
        element.innerHTML = '.';
    }
    element.style.transform = 'rotate(90deg)';
    element.style.textAlign = 'center';
});


let indexOfLetterTyped = 1;
let indexOfRowToFill = 0;

document.addEventListener('keydown', handleUserInput);


function handleUserInput(event) {

    if (event.key === "Enter" || event.key === "Backspace" || event.key.match(/^[a-zA-Z]$/i)) {
        if (event.key === "Enter") {
            // debugger
            if(indexOfRowToFill > 6) return
            // If the user presses the enter key, check if the word is complete
            // and if it is, check if the word is correct
            let letters = [];
            // Create an array of the letters typed by the user
            rows[indexOfRowToFill].forEach((element) => {
                if(element.innerHTML !== '.'){
                    letters.push(element.innerHTML.toLowerCase());
                }
            });
            // If the word is not complete, return
            if (letters.length < randomWord.length) {
                // If the word is complete, check if the word is correct
                console.log('word is incomplete');
                resultContainer.innerHTML = 'The word is incomplete';
                setTimeout(() => {
                    resultContainer.innerHTML = '';
                }, 3000);
                return;
            }

            let randomWordCopy = randomWord;
            // Replace the letters that are known by a dot
            letters.forEach((letter, index) => {
                if(wordIndexesToFill.includes(index)) {
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
            if(wordIndexesToFill.length === randomWord.length) {
                console.log('word complete');
                resultContainer.innerHTML = 'The word is complete';
                setTimeout(() => {
                    resultContainer.innerHTML = '';
                }, 3000);
                return
            }

            if(indexOfRowToFill !== 6) {
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
                console.log("you loose")
                resultContainer.innerHTML = 'You loose';
                setTimeout(() => {
                    resultContainer.innerHTML = '';
                }, 3000);
                return
                // TODO: display a message to the user
            }
        }
        if (event.key === "Backspace") {
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