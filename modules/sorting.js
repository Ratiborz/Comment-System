import { comments, showAnswer, initAnswersEvent } from './main.js';
import { timeConverter } from './utils.js';
const triangle = document.querySelector('.triangle');
const commentField = document.querySelector('.comment-field');
let activeTriangle;
let transformTriangle = false;
function insertingImage(target, dropDown) {
    const imageMark = new Image();
    imageMark.src = './images/check-mark.svg';
    imageMark.alt = 'Check-Mark';
    imageMark.classList.add('selected');
    if (target.matches('.drop-down__list--p') || target.matches('.drop-down__list--li')) {
        dropDown.querySelectorAll('.selected').forEach((mark) => {
            mark.remove();
        });
        if (target.classList.value === 'drop-down__list--p') {
            const element = target.parentElement.querySelector(`[data="${activeTriangle}"]`);
            if (element) {
                element.insertAdjacentHTML('beforebegin', imageMark.outerHTML);
            }
        }
        else if (target.classList.value === 'drop-down__list--li') {
            const element = target.querySelector(`[data="${activeTriangle}"]`);
            if (element) {
                element.insertAdjacentHTML('beforebegin', imageMark.outerHTML);
            }
        }
    }
}
export function sortingComments(dropDown) {
    const nameSorting = document.querySelector('.filters');
    dropDown.addEventListener('click', function (event) {
        const target = event.target;
        activeTriangle = parseInt(target.getAttribute('data'));
        if (activeTriangle === 0) {
            insertingImage(target, dropDown);
            nameSorting.innerHTML = 'По дате';
        }
        if (activeTriangle === 1) {
            insertingImage(target, dropDown);
            nameSorting.innerHTML = 'По количеству оценок';
        }
        if (activeTriangle === 2) {
            insertingImage(target, dropDown);
            nameSorting.innerHTML = 'По актуальности';
        }
        if (activeTriangle === 3) {
            insertingImage(target, dropDown);
            nameSorting.innerHTML = 'По количеству ответов';
        }
    });
}
triangle.addEventListener('click', function (event) {
    const target = event.target;
    if (activeTriangle === 0) {
        transformTriangle = !transformTriangle;
        const commentsRaiting = comments.slice();
        if (transformTriangle) {
            target.style.transform = 'rotate(360deg)';
            commentsRaiting.sort((a, b) => a.time - b.time);
            commentField.innerHTML = '';
            commentsRaiting.forEach((comment, index) => {
                commentField.innerHTML += renderComment(comment, index);
            });
            initAnswersEvent();
        }
        else {
            target.style.transform = 'rotate(180deg)';
            commentsRaiting.sort((a, b) => b.time - a.time);
            commentField.innerHTML = '';
            commentsRaiting.forEach((comment, index) => {
                commentField.innerHTML += renderComment(comment, index);
            });
            initAnswersEvent();
        }
    }
    if (activeTriangle === 1) {
        transformTriangle = !transformTriangle;
        const commentsRaiting = comments.slice();
        if (transformTriangle) {
            target.style.transform = 'rotate(360deg)';
            commentsRaiting.sort((a, b) => a.rating - b.rating);
            commentField.innerHTML = '';
            commentsRaiting.forEach((comment, index) => {
                commentField.innerHTML += renderComment(comment, index);
            });
            initAnswersEvent();
        }
        else {
            target.style.transform = 'rotate(180deg)';
            commentsRaiting.sort((a, b) => b.rating - a.rating);
            commentField.innerHTML = '';
            commentsRaiting.forEach((comment, index) => {
                commentField.innerHTML += renderComment(comment, index);
            });
            initAnswersEvent();
        }
    }
    if (activeTriangle == 2) {
        transformTriangle = !transformTriangle;
        const commentsRaiting = comments.slice();
        if (transformTriangle) {
            target.style.transform = 'rotate(360deg)';
            commentsRaiting.sort((a, b) => a.time - b.time);
            commentField.innerHTML = '';
            commentsRaiting.forEach((comment, index) => {
                commentField.innerHTML += renderComment(comment, index);
            });
            initAnswersEvent();
        }
        else {
            target.style.transform = 'rotate(180deg)';
            commentsRaiting.sort((a, b) => b.time - a.time);
            commentField.innerHTML = '';
            commentsRaiting.forEach((comment, index) => {
                commentField.innerHTML += renderComment(comment, index);
            });
            initAnswersEvent();
        }
    }
    if (activeTriangle == 3) {
        transformTriangle = !transformTriangle;
        const commentsRaiting = comments.slice();
        if (transformTriangle) {
            target.style.transform = 'rotate(360deg)';
            commentsRaiting.sort((a, b) => a.answers.length - b.answers.length);
            commentField.innerHTML = '';
            commentsRaiting.forEach((comment, index) => {
                commentField.innerHTML += renderComment(comment, index);
            });
            initAnswersEvent();
        }
        else {
            target.style.transform = 'rotate(180deg)';
            commentsRaiting.sort((a, b) => b.answers.length - a.answers.length);
            commentField.innerHTML = '';
            commentsRaiting.forEach((comment, index) => {
                commentField.innerHTML += renderComment(comment, index);
            });
            initAnswersEvent();
        }
    }
});
function renderComment(comment, commentIndex) {
    let out = '';
    out += `<div class="static-comment" data-index="${commentIndex}">
        <div class="static-comment__flex">
        <img src="./images/Max.png" alt="Max" class="static-comment__avatar">
        <div class="second-part-commit">
            <div class="commit-info">
                <p class="commit-nickname">${comment.name}</p>
                <p class="time">${timeConverter(comment.time)}</p>
            </div>
            <p class="commit-text">${comment.body}</p>
            <div class="commit-actions">
                <img src="./images/Send.svg" alt="send" class="send-svg">
                <p class="commit-reply">Ответить</p>
                <img src="./images/Empty-heart.svg" alt="heart" class="heart-svg">
                <p class="favorites">В избранное</p>
                <img src="./images/Minus.svg" alt="minus" data-parent="${commentIndex}" class="minus-svg">
                <span class="number-likes">${comment.rating}</span>
                <img src="./images/Plus.svg" alt="plus" data-parent="${commentIndex}" class="plus-svg">
            </div>
        </div>
    </div>
    <div class="text_btn writing-answers reply-input" style="display: none;">
                <div class="comment-body reply-comment-body" tabindex="0" contenteditable="true" role="textbox" aria-multiline="true"></div>
                <div class="placeholder">
                    <div class="ph_input">
                        <div class="ph_content">Введите текст сообщения...</div>
                    </div>
                </div>
                <button class="send__btn" disabled>Отправить</button>
                <button class="send__btn svg-cross__btn"><img src="./images/cross-svgrepo-com.svg" alt="cross" class="svg-cross"></button>
            </div>
            <div class="reply-field">${showAnswer(comment.answers, commentIndex)}</div>
</div>`;
    return out;
}
