import {
    commentName,
    commentBody,
    button,
    symbolsLimit,
    placeholder,
} from './constants.js';

let comments = [];
let answers = [];
loadComments();

document.querySelector('.send__btn').addEventListener('click',  function() {
    event.preventDefault();
    let comment = {
        name: commentName.textContent,
        body: commentBody.innerText,
        time: Math.floor(Date.now() / 1000),
    };
    commentBody.innerText = '';
    comments.push(comment);

    saveComments();
    showComments();
    button.style.backgroundColor = '';
    symbolsLimit.innerHTML = `Макс. 1000 символов`;
    symbolsLimit.classList.remove('active');
    symbolsLimit.style.marginLeft = '';
    button.disabled = true;
    button.style.cursor = 'default';
    placeholder.style.display = 'block';
});

function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
    if (localStorage.getItem('comments')) comments = JSON.parse(localStorage.getItem('comments'));
    showComments();
}

function showComments() {
    let commentField = document.getElementById('comment-field');
    let out = '';
    comments.forEach(function (item) {
        out += `<div class="static-comment">
            <div class="static-comment__flex">
            <img src="./images/Max.png" alt="Max" class="avatar">
            <div class="second-part-commit">
                <div class="commit-info">
                    <p class="commit-nickname">${item.name}</p>
                    <p class="time">${timeConverter(item.time)}</p>
                </div>
                <p class="commit-text">${item.body}</p>
                <div class="commit-actions">
                    <img src="./images/Send.svg" alt="send" class="send-svg">
                    <p class="commit-reply">Ответить</p>
                    <img src="./images/Empty-heart.svg" alt="heart" class="heart-svg">
                    <p class="favorites">В избранном</p>
                    <img src="./images/Minus.svg" alt="minus" class="minus-svg">
                    <span class="number-likes">0</span>
                    <img src="./images/Plus.svg" alt="plus" class="plus-svg">
                </div>
            </div>
        </div>
        <div class="text_btn writing-answers reply-input" style="display: none;">
                    <div class="comment-body reply-comment-body" tabindex="0" contenteditable="true" role="textbox" aria-multiline="true">
            
                    </div>
                    <div class="placeholder">
                        <div class="ph_input">
                            <div class="ph_content">Введите текст сообщения...</div>
                        </div>
                    </div>
                    <button class="send__btn" disabled>Отправить</button>
                    <button class="send__btn svg-cross__btn"><img src="./images/cross-svgrepo-com.svg" alt="cross" class="svg-cross"></button>
                </div>
                <div class="reply-field">

                </div>
    </div>`;
    });
    commentField.innerHTML = out;
    initAnswersEvent();
}

commentBody.addEventListener('input', handleInput);
commentBody.addEventListener('paste', banImage);
commentBody.addEventListener('paste', banHtmlTag);

function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = String(a.getMinutes()).padStart(2, '0');
    let sec = a.getSeconds();
    let time = `${date}.${month} ${hour}:${min}`;
    return time;
}

function handleInput(event) {
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

function banImage(event)  {
    const clipboardData = event.clipboardData || window.clipboardData;

    if (clipboardData) {
        // Проверяем, есть ли изображение в буфере обмена
        if (clipboardData.types && clipboardData.types.includes('Files')) {
            // Отменяем вставку изображений
            event.preventDefault();
            alert('Вставка изображений запрещена.');
        }
    }
};

function banHtmlTag(event) {
    event.preventDefault();
    let text = event.clipboardData.getData('text/plain');
    let strippedText = text.replace(/(<([^>]+)>)/gi, '');
    document.execCommand('insertHTML', false, strippedText);
};

function initAnswersEvent() {
    const replyButtons = document.querySelectorAll('.commit-reply');
    
    replyButtons.forEach((button) => {
         button.addEventListener('click', function () {
             // Скрываем все другие поля ввода
             const allReplyInputs = document.querySelectorAll('.reply-input');
             allReplyInputs.forEach((replyInput) => {
                 replyInput.style.display = 'none';
             });
             
             // Находим ближайший родительский комментарий и его поле ввода
             const comment = this.closest('.static-comment');
             const replyInput = comment.querySelector('.reply-input');
             const replyCommentBody = comment.querySelector('.reply-comment-body');
             const currentButton = comment.querySelector('.send__btn');
             const currentButtonExit = comment.querySelector('.svg-cross__btn');
             const commentReplyName = comment.querySelector('.commit-nickname');
             const commentReplyBody = replyCommentBody;
             
             // Показываем поле ввода только для текущего комментария
             replyInput.style.display = 'flex';

             replyCommentBody.addEventListener('paste', banImage);
             replyCommentBody.addEventListener('paste', banHtmlTag);
             replyCommentBody.addEventListener('input', handleInput);

             currentButton.addEventListener('click', function() {
                event.preventDefault();
                let answer = {
                    name: commentReplyName.textContent,
                    body: commentReplyBody.innerText,
                    time: Math.floor(Date.now() / 1000),
                };

                replyCommentBody.innerText = '';
                replyInput.style.display = 'none';
                answers.push(answer);
                
                showAnswer(comment);
             });

             currentButtonExit.addEventListener('click', function() {
                exitReply(replyInput, replyCommentBody);
             });
             
         });
     });
}

function showAnswer(comment) {
    let replyField = comment.querySelector('.reply-field');
    let out = '';
    answers.forEach(function (item) {
            out += `<div class="static-comment__reply">
                <img src="./images/Masturbek.png" alt="Masturbek" class="static-comment__avatar">
                <div class="second-part-commit">
                    <div class="commit-info">
                        <p class="commit-nickname reply-name">Джунбокс3000</p>
                        <img src="./images/Send.svg" alt="send">
                        <p class="reply-nickname">${item.name}</p>
                        <p class="time">${timeConverter(item.time)}</p>
                    </div>
                    <p class="commit-text">${item.body}</p>
                    <div class="commit-actions">
                        <img src="./images/Empty-heart.svg" alt="heart" class="heart-svg">
                        <p class="favorites">В избранном</p>
                        <img src="./images/Minus.svg" alt="minus" class="minus-svg">
                        <span class="number-likes">0</span>
                        <img src="./images/Plus.svg" alt="plus" class="plus-svg">
                    </div>
                </div>
            </div>`;
    });
    replyField.innerHTML = out;
}

function exitReply(replyInput, replyCommentBody) {
    replyInput.style.display = 'none';
    replyCommentBody.innerText = '';
}


