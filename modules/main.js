import { commentName, commentBody, button, symbolsLimit, placeholder } from './constants.js';
import { handleInput, banImage, banHtmlTag } from './inputProcessing.js';
import { timeConverter, numbOfComments, exitReply } from './utils.js';
import { ratingCount } from './rating.js';
import { favoritesRegistration, pasteImageFavorites, drawFavorites } from './favouritesSystem.js';
import { sortingComments } from './sorting.js';

export let comments = [];
export const commentField = document.querySelector('.comment-field');
loadComments();

document.querySelector('.send__btn').addEventListener('click', function () {
    event.preventDefault();
    let comment = {
        name: commentName.textContent,
        body: commentBody.innerText,
        time: Math.floor(Date.now() / 1000),
        answers: [],
        rating: 0,
        is_favorite: false,
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

export function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
    if (localStorage.getItem('comments')) comments = JSON.parse(localStorage.getItem('comments'));
    showComments();
    pasteImageFavorites();
}

function showComments() {
    let out = '';
    comments.forEach(function (item, commentIndex) {
        out += `<div class="static-comment" data-index="${commentIndex}">
            <div class="static-comment__flex">
            <img src="./images/Max.png" alt="Max" class="static-comment__avatar">
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
                    <p class="favorites">В избранное</p>
                    <img src="./images/Minus.svg" alt="minus" data-parent="${commentIndex}" class="minus-svg">
                    <span class="number-likes">${item.rating}</span>
                    <img src="./images/Plus.svg" alt="plus" data-parent="${commentIndex}" class="plus-svg">
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
                <div class="reply-field">${showAnswer(item.answers, commentIndex)}</div>
    </div>`;
    });

    commentField.innerHTML = out;
    initAnswersEvent();
    numbOfComments();
    pasteImageFavorites();
}

commentBody.addEventListener('input', (event) => handleInput(event));
commentBody.addEventListener('paste', (event) => banImage(event));
commentBody.addEventListener('paste', (event) => banHtmlTag(event));

export function initAnswersEvent() {
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

            currentButton.addEventListener('click', function () {
                event.preventDefault();
                let answer = {
                    name: commentReplyName.textContent,
                    body: commentReplyBody.innerText,
                    time: Math.floor(Date.now() / 1000),
                    rating: 0,
                    is_favorite: false,
                };

                replyCommentBody.innerText = '';
                replyInput.style.display = 'none';
                comments[commentIndex].answers.push(answer);
                saveComments();
                showComments();
            });

            currentButtonExit.addEventListener('click', function () {
                exitReply(replyInput, replyCommentBody);
            });
        });
    });
}

export function showAnswer(answers, commentParent) {
    let out = '';
    answers.forEach(function (answer, indexAnswer) {
        out += `<div class="static-comment__reply" data-index="${indexAnswer}">
                <img src="./images/Masturbek.png" alt="Masturbek" class="static-comment__avatar static-comment__avatar-answer">
                <div class="second-part-commit">
                    <div class="commit-info commit-info__answer">
                        <p class="commit-nickname reply-name">Джунбокс3000</p>
                        <img src="./images/Send.svg" alt="send" class="sendler-answer">
                        <p class="reply-nickname">${answer.name}</p>
                        <p class="time time-answer">${timeConverter(answer.time)}</p>
                    </div>
                    <p class="commit-text">${answer.body}</p>
                    <div class="commit-actions">
                        <img src="./images/Empty-heart.svg" alt="heart" class="heart-svg">
                        <p class="favorites">В избранное</p>
                        <img src="./images/Minus.svg" alt="minus" data-index="${indexAnswer}" data-parent="${commentParent}" class="minus-svg minus-svg__answer">
                        <span class="number-likes">${answer.rating}</span>
                        <img src="./images/Plus.svg" alt="plus" data-index="${indexAnswer}" data-parent="${commentParent}" class="plus-svg plus-svg__answer">
                    </div>
                </div>
            </div>`;
    });
    return out;
}

document.addEventListener('click', function (event) {
    const target = event.target;

    // Проверяем, является ли кликнутый элемент кнопкой плюс
    if (target.matches('.plus-svg')) {
        ratingCount(target, 'plus');
    }

    // Проверяем, является ли кликнутый элемент кнопкой минус
    if (target.matches('.minus-svg')) {
        ratingCount(target, 'minus');
    }

    // Добавление в избранное
    if (target.matches('.favorites')) {
        favoritesRegistration(target);
    }

    // Вывод на экран избранных комментариев
    if (target.matches('.favourites')) {
        drawFavorites();
    }

    // Выбор сортировки
    if (target.matches('.filters')) {
        const dropDown = document.querySelector('.drop-down');
        const displayInfo = window.getComputedStyle(dropDown).display;

        if (displayInfo === 'none') {
            dropDown.style.display = 'block';
            sortingComments(dropDown);
        } else {
            dropDown.style.display = 'none';
        }
    }
});
