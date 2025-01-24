import { showErrorMessage, showMessage } from "./messagesScript.js";

const passwordBox = document.getElementById('password');
const lengthInput = document.getElementById('passwordLength');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
const numbers = '0123456789';
const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
const specialCharacters = '!@#$%^&*()';

let currentId = parseInt(localStorage.getItem('currentId')) || 1;
let randomPasswords = JSON.parse(localStorage.getItem('RandomPasswords')) || [];

function createPassword() {
    const length = parseInt(lengthInput.value) || 12;

    if (length < 8 || length > 30) {
        showErrorMessage('Length must be between 8 and 30 characters!');
        return false;
    }

    const includeUpperCase = document.getElementById('uppercase').checked;
    const includeLowerCase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSpecial = document.getElementById('special').checked;

    if (!includeUpperCase && !includeLowerCase && !includeNumbers && !includeSpecial) {
        showErrorMessage('At least one option must be selected!');
        return false;
    }

    let availableChars = '';
    if (includeUpperCase) availableChars += upperCase;
    if (includeLowerCase) availableChars += lowerCase;
    if (includeNumbers) availableChars += numbers;
    if (includeSpecial) availableChars += specialCharacters;

    let password = '';
    while (password.length < length) {
        password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    if (passwordBox) {
        passwordBox.value = password;
    }
    return password;
}

function saveToStorage() {
    localStorage.setItem('RandomPasswords', JSON.stringify(randomPasswords));
    localStorage.setItem('currentId', currentId);
}

function loadFromStorage() {
    let storedPasswords = JSON.parse(localStorage.getItem('RandomPasswords'));
    if (storedPasswords) {
        randomPasswords = storedPasswords;
        displayPasswords();
    }
}

function displayPasswords() {
    const passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = '';
    
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>ID</th><th>Password</th><th>Actions</th>`;
    table.appendChild(headerRow);
    
    randomPasswords.forEach(passwordObj => {
        const row = document.createElement('tr');
    
        const idCell = document.createElement('td');
        idCell.textContent = passwordObj.id;
    
        const passwordCell = document.createElement('td');
        passwordCell.textContent = passwordObj.password;
    
        const actionsCell = document.createElement('td');
        const copyButton = document.createElement('img');
        copyButton.src = "images/copy.png";
        copyButton.classList.add('copy-button');
        copyButton.setAttribute('data-password', passwordObj.password);
        copyButton.alt = "Copy";
    
        const deleteButton = document.createElement('img');
        deleteButton.src = "images/close.png";
        deleteButton.classList.add('delete-button');
        deleteButton.setAttribute('data-id', passwordObj.id);
        deleteButton.alt = "Delete";
    
        actionsCell.appendChild(copyButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(idCell);
        row.appendChild(passwordCell);
        row.appendChild(actionsCell);
    
        table.appendChild(row);
    });
    
    passwordList.appendChild(table);
}

document.querySelector('#passwordList').addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains('delete-button')) {
        deletePassword(event);
    }
});

function deletePassword(event) {
    const passwordId = parseInt(event.target.getAttribute('data-id'));

    if (!passwordId) return;

    randomPasswords = randomPasswords.filter(passwordObj => passwordObj.id !== passwordId);

    saveToStorage();
    displayPasswords();
}

document.querySelector('#passwordList').addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains('copy-button')) {
        copyPassword(event);
    }
});

function copyPassword(event) {
    const password = event.target.getAttribute('data-password') || passwordBox.value;

    if (!password) {
        showErrorMessage('There is no password!');
        return;
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(password)
            .then(() => {
                showMessage();
            })
            .catch(err => {
                showErrorMessage('Copy failed: ' + err);
            });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showMessage();
    }
}

document.getElementById('copyButton').addEventListener('click', copyPassword);

document.querySelector('.button-generate-pass').addEventListener('click', () => {
    const password = createPassword();
    if (!password) return;
    
    const newPassword = {
        id: currentId++,
        password: password
    };
    randomPasswords.push(newPassword);
    saveToStorage();
    displayPasswords();
});

window.addEventListener('load', () => {
    loadFromStorage();
});

function clearLatestPasswords() {
    localStorage.removeItem('RandomPasswords'); 
    localStorage.setItem('currentId', 1);       
    randomPasswords = [];
    currentId = 1;
    displayPasswords();
}

document.querySelector('.button-clear-passwords').addEventListener('click', () => {
    clearLatestPasswords();
});
