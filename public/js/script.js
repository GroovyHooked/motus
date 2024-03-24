
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const firstName = document.querySelector('.input-firstname');
const lastName = document.querySelector('.input-lastname');
const email = document.querySelector('.input-email');
const password = document.querySelector('.input-password');

const singupSubmitButton = document.querySelector('.button-submit.signup');
const loginSubmitButton = document.querySelector('.button-submit.login');

const displayMessage = (message) => {
    document.querySelector('.message-container').innerHTML = message;
}

const validateUserInput = (firstName, lastName, email, password) => {
    if (!firstName || !lastName || !email || !password) {
        displayMessage('Tous les champs sont obligatoires');
        return false;
    }
    const isPasswordValid = passwordRegex.test(password);
    const isEmailValid = emailRegex.test(email);
    if (!isEmailValid) {
        displayMessage('Adresse email invalide');
        return false;
    }
    if (!isPasswordValid) {
        displayMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
        return false;
    }
    return true;
}

const validateLoginInput = (email, password) => {
    if (!email || !password) {
        displayMessage('Tous les champs sont obligatoires');
        return false;
    }
    const isEmailValid = emailRegex.test(email);
    if (!isEmailValid) {
        displayMessage('Adresse email invalide');
        return false;
    }
    return true;
}

if (singupSubmitButton) {
    singupSubmitButton.addEventListener('click', () => {
        const { value: firstNameValue } = firstName;
        const { value: lastNameValue } = lastName;
        const { value: emailValue } = email;
        const { value: passwordValue } = password;
        if (validateUserInput(firstNameValue, lastNameValue, emailValue, passwordValue)) {
            sendUserSignupData(firstNameValue, lastNameValue, emailValue, passwordValue);
        }
    });
}

if (loginSubmitButton) {
    loginSubmitButton.addEventListener('click', () => {
        console.log(email?.value, password?.value);
        const { value: emailValue } = email;
        const { value: passwordValue } = password;
        if(validateLoginInput(emailValue, passwordValue)) {
            sendUserLoginData(emailValue, passwordValue);
        }
    });
}



function sendUserSignupData(firstName, lastName, email, password) {
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to login page
            window.location.href = '/login?data=' + encodeURIComponent(data.message);
        } else {
            // Show error message without reloading the page
            displayMessage(data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function sendUserLoginData(email, password) {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to game page
            window.location.href = '/motus';
        } else {
            // Show error message without reloading the page
            displayMessage(data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}