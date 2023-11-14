import { button, symbolsLimit, placeholder } from './constants.js';

export function handleInput(event) {
    let inputClass = event.target.classList.value;
    let inputForAnswers = event.target.classList.contains('reply-comment-body');

    let symbols = event.target.innerText.replace(/\s/g, '');
    let count = symbols.length;

    // Для основного ввода
    if (inputClass === 'comment-body') {
        if (count) {
            button.style.backgroundColor = '#ABD873';
        } else {
            button.style.backgroundColor = '';
        }

        if (count) {
            symbolsLimit.innerHTML = `${count}/1000`;
            symbolsLimit.style.marginLeft = '82px';
            placeholder.style.display = 'none';
        } else {
            symbolsLimit.innerHTML = 'Макс. 1000 символов';
            symbolsLimit.style.marginLeft = '';
            placeholder.style.display = 'block';
        }

        if (count > 1000) {
            symbolsLimit.innerHTML = `${count}/1000 <p class='error-output'>Слишком длинное сообщение</p>`;
            symbolsLimit.classList.add('active');
            button.style.backgroundColor = '#A1A1A1';
            button.disabled = true;
            button.style.cursor = 'default';
        } else if (count <= 1000 && count >= 1) {
            symbolsLimit.classList.remove('active');
            button.disabled = false;
            button.style.cursor = 'pointer';
        } else if (count <= 0) {
            button.disabled = true;
            button.style.cursor = 'default';
        }
    }
    // Для другого инпута replyInput
    else if (inputForAnswers) {
        // Обработка ввода в инпуте ответов
        // Поиск элементов внутри текущего инпута ответов
        let currentInput = event.target;
        let currentButton = currentInput.parentElement.querySelector('.send__btn');
        let currentPlaceholder = currentInput.parentElement.querySelector('.placeholder');

        if (count) {
            currentButton.style.backgroundColor = '#ABD873';
        } else {
            currentButton.style.backgroundColor = '';
        }

        if (count) {
            currentPlaceholder.style.display = 'none';
        } else {
            currentPlaceholder.style.display = 'block';
        }

        if (count > 1000) {
            currentButton.style.backgroundColor = '#A1A1A1';
            currentButton.disabled = true;
            currentButton.style.cursor = 'default';
        } else if (count <= 1000 && count >= 1) {
            currentButton.disabled = false;
            currentButton.style.cursor = 'pointer';
        } else if (count <= 0) {
            currentButton.disabled = true;
            currentButton.style.cursor = 'default';
        }
    }
}

export function banImage(event) {
    const clipboardData = event.clipboardData || window.clipboardData;

    if (clipboardData) {
        // Проверяем, есть ли изображение в буфере обмена
        if (clipboardData.types && clipboardData.types.includes('Files')) {
            // Отменяем вставку изображений
            event.preventDefault();
            alert('Вставка изображений запрещена.');
        }
    }
}

export function banHtmlTag(event) {
    event.preventDefault();
    let text = event.clipboardData.getData('text/plain');
    let strippedText = text.replace(/(<([^>]+)>)/gi, '');
    document.execCommand('insertHTML', false, strippedText);
}