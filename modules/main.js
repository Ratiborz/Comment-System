import {commentName, commentBody, button, symbolsLimit, placeholder,} from './constants.js';
import {handleInput, banImage, banHtmlTag} from './inputProcessing.js';
import {timeConverter, numbOfComments} from './utils.js';

export let comments = [];
loadComments();

document.querySelector('.send__btn').addEventListener('click',  function() {
    event.preventDefault();
    let comment = {
        name: commentName.textContent,
        body: commentBody.innerText,
        time: Math.floor(Date.now() / 1000),
        answers: [],
        rating: 0, 
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
    let commentIndex = 0;
    let out = '';
    comments.forEach(function (item) {
        out += `<div class="static-comment" data-index="${commentIndex++}">
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
                    <span class="number-likes">${item.rating}</span>
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
                <div class="reply-field">${showAnswer(item.answers)}</div>
    </div>`;
    });
    
    commentField.innerHTML = out;
    initAnswersEvent();
    numbOfComments();
}

commentBody.addEventListener('input', (event) => handleInput(event));
commentBody.addEventListener('paste', (event) => banImage(event));
commentBody.addEventListener('paste', (event) => banHtmlTag(event));

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
             let commentIndex = comment.getAttribute('data-index');
             
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
                    rating: 0,
                };

                replyCommentBody.innerText = '';
                replyInput.style.display = 'none';
                comments[commentIndex].answers.push(answer);
                saveComments();
                showComments();
             });

             currentButtonExit.addEventListener('click', function() {
                exitReply(replyInput, replyCommentBody);
             });
             
         });
     });
}

function showAnswer(answers) {
    let out = '';
    let commentIndex = 0;
    answers.forEach(function (answer) {
            out += `<div class="static-comment__reply" data-index="${commentIndex++}">
                <img src="./images/Masturbek.png" alt="Masturbek" class="static-comment__avatar">
                <div class="second-part-commit">
                    <div class="commit-info">
                        <p class="commit-nickname reply-name">Джунбокс3000</p>
                        <img src="./images/Send.svg" alt="send">
                        <p class="reply-nickname">${answer.name}</p>
                        <p class="time">${timeConverter(answer.time)}</p>
                    </div>
                    <p class="commit-text">${answer.body}</p>
                    <div class="commit-actions">
                        <img src="./images/Empty-heart.svg" alt="heart" class="heart-svg">
                        <p class="favorites">В избранном</p>
                        <img src="./images/Minus.svg" alt="minus" class="minus-svg">
                        <span class="number-likes">${answer.rating}</span>
                        <img src="./images/Plus.svg" alt="plus" class="plus-svg">
                    </div>
                </div>
            </div>`;
        });
    return out;
}

function exitReply(replyInput, replyCommentBody) {
    replyInput.style.display = 'none';
    replyCommentBody.innerText = '';
}

const plusButtons = document.querySelectorAll('.plus-svg');
const minusButtons = document.querySelectorAll('.minus-svg');

plusButtons.forEach((plusButton) => {
    plusButton.addEventListener('click', function() {
        ratingCount(this, 'plus');
    });
})

minusButtons.forEach((minusButton) => {
    minusButton.addEventListener('click', function() {
        ratingCount(this, 'minus');
    });
})
 
function ratingCount(element, symbol) {
    const comment = element.parentNode.parentNode.parentNode.parentNode.closest('.static-comment');
    const keyAnswer = element.parentNode.parentNode.parentNode;
    let commentIndex = comment.getAttribute('data-index');
    let answerIndex = keyAnswer.getAttribute('data-index');

    if (keyAnswer.classList.value === 'static-comment__reply' && symbol === 'plus') {
        comments[commentIndex].answers[answerIndex].rating += 1;
        console.log(comments[commentIndex].answers[answerIndex])
        showComments();
        saveComments();
    }
    else if (keyAnswer.classList.value === 'static-comment__reply' && symbol === 'minus') {
        comments[commentIndex].answers[answerIndex].rating -= 1;
        console.log(comments[commentIndex].answers[answerIndex])
        showComments();
        saveComments();
    }
    
    if (keyAnswer.classList.value !== 'static-comment__reply') {
        if (comment.classList.value === 'static-comment' && symbol === 'plus') {
            comments[commentIndex].rating += 1;
            console.log(comments[commentIndex]);
            showComments();
            saveComments();
        } 
        else if (comment.classList.value === 'static-comment' && symbol === 'minus') {
            comments[commentIndex].rating -= 1;
            console.log(comments[commentIndex]);
            showComments();
            saveComments();
        }
    }
}