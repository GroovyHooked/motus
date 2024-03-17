
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const firstName = document.querySelector('.input-firstname');
const lastName = document.querySelector('.input-lastname');
const email = document.querySelector('.input-email');
const password = document.querySelector('.input-password');

const singupSubmitButton = document.querySelector('.button-submit.signup');
const loginSubmitButton = document.querySelector('.button-submit.login');

if (singupSubmitButton) {
    singupSubmitButton.addEventListener('click', () => {
        console.log(firstName?.value, lastName?.value, email?.value, password?.value);
        if (!firstName?.value || !lastName?.value || !email?.value || !password?.value) {
            document.querySelector('.message-container').innerHTML = 'All fields are required';
            return;
        }
        const isPasswordValid = passwordRegex.test(password.value);
        const isEmailValid = emailRegex.test(email.value);
        if (!isEmailValid) {
            document.querySelector('.message-container').innerHTML = 'Invalid email';
            return;
        }
        if (!isPasswordValid) {
            document.querySelector('.message-container').innerHTML = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number';
            return;
        }
        sendUserSignupData(firstName.value, lastName.value, email.value, password.value);
    });
}

if (loginSubmitButton) {
    loginSubmitButton.addEventListener('click', () => {
        console.log(email?.value, password?.value);
        if (!email?.value || !password?.value) {
            document.querySelector('.message-container').innerHTML = 'All fields are required';
            return;
        }
        const isEmailValid = emailRegex.test(email.value);
        if (!isEmailValid) {
            document.querySelector('.message-container').innerHTML = 'Invalid email';
            return;
        }
        sendUserLoginData(email.value, password.value);
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
            console.log(data.message, '\nRedirecting to login page');
            window.location.href = '/login?data=' + encodeURIComponent(data.message);
        } else {
            // Show error message without reloading the page
            document.querySelector('.message-container').innerHTML = data.message;
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
            console.log('Redirecting to game page');
            window.location.href = '/motus?data=' + encodeURIComponent(data.email);
        } else {
            // Show error message without reloading the page
            document.querySelector('.message-container').innerHTML = data.message;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}