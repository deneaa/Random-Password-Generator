let fadeOutTimeout, hideTimeout, errorFadeOutTimeout, errorHideTimeout;

function resetProgressBar(progressBar) {
    progressBar.classList.remove('animate');
    void progressBar.offsetWidth;
    progressBar.classList.add('animate');
}

function resetCopyMessage() {
    const copyMessage = document.getElementById('copyMessage');
    const progressBar = document.getElementById('progressBar');

    copyMessage.classList.remove('show', 'fade-out');
    resetProgressBar(progressBar);
    clearTimeout(fadeOutTimeout);
    clearTimeout(hideTimeout);
}

function resetErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    const errorProgressBar = document.getElementById('errorProgressBar');

    errorMessage.classList.remove('show', 'fade-out');
    resetProgressBar(errorProgressBar);
    clearTimeout(errorFadeOutTimeout);
    clearTimeout(errorHideTimeout);
}

export function showMessage() {
    const copyMessage = document.getElementById('copyMessage');
    const progressBar = document.getElementById('progressBar');
    const closeButton = copyMessage.querySelector('.closebtn');
    resetErrorMessage();

    const resetMessage = () => {
        copyMessage.classList.remove('show', 'fade-out');
        resetProgressBar(progressBar);
        clearTimeout(fadeOutTimeout);
        clearTimeout(hideTimeout);
    };

    closeButton.addEventListener('click', resetMessage);

    resetMessage();

    copyMessage.classList.add('show');
    progressBar.classList.add('animate');

    fadeOutTimeout = setTimeout(() => {
        copyMessage.classList.add('fade-out');
    }, 9000);

    hideTimeout = setTimeout(() => {
        resetMessage();
    }, 10000);
}

export function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorProgressBar = document.getElementById('errorProgressBar');
    const closeButton = errorMessage.querySelector('.closebtn');
    resetCopyMessage();

    const resetErrorMessage = () => {
        errorMessage.classList.remove('show', 'fade-out');
        resetProgressBar(errorProgressBar);
        clearTimeout(errorFadeOutTimeout);
        clearTimeout(errorHideTimeout);
    };

    if (errorMessage.classList.contains('show')) {
        resetErrorMessage();
    }

    const newCloseButton = closeButton.cloneNode(true);
    closeButton.parentNode.replaceChild(newCloseButton, closeButton);

    newCloseButton.addEventListener('click', resetErrorMessage);

    if (message) {
        errorMessage.querySelector('strong').textContent = message;
    }

    errorMessage.classList.add('show');
    errorProgressBar.classList.add('animate');
    errorProgressBar.style.width = '0%';

    errorFadeOutTimeout = setTimeout(() => {
        errorMessage.classList.add('fade-out');
    }, 9000);

    errorHideTimeout = setTimeout(() => {
        resetErrorMessage();
    }, 10000);
}
