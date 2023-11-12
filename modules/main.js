import {commentName, commentBody, button, symbolsLimit, placeholder,} from './constants.js';
import {handleInput, banImage, banHtmlTag} from './inputProcessing.js';
import {timeConverter, numbOfComments} from './utils.js';
import {ratingCount} from './rating.js';
import {favoritesRegistration, pasteImageFavorites, drawFavorites} from './favouritesSystem.js';

export let comments = [];
let transformTriangle = false;
loadComments();

document.querySelector('.send__btn').addEventListener('click',  function() {
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
    showComments(comments);
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
    showComments(comments);
    pasteImageFavorites();
}

function showComments(array) {
    let commentField = document.getElementById('comment-field');
    let out = '';
    array.forEach(function (item, commentIndex ) {
        out += `<div class="static-comment" data-index="${commentIndex}">
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
                    is_favorite: false,
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

function showAnswer(answers, commentParent) {
    let out = '';
    answers.forEach(function (answer, indexAnswer) {
            out += `<div class="static-comment__reply" data-index="${indexAnswer}">
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
                        <img src="./images/Minus.svg" alt="minus" data-index="${indexAnswer}" data-parent="${commentParent}" class="minus-svg">
                        <span class="number-likes">${answer.rating}</span>
                        <img src="./images/Plus.svg" alt="plus" data-index="${indexAnswer}" data-parent="${commentParent}" class="plus-svg">
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

document.addEventListener('click', function(event) {
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

    if (target.matches('.filters')) {
        const dropDown = document.querySelector('.drop-down');
        const displayInfo = window.getComputedStyle(dropDown).display;

        if (displayInfo === 'none') {
            dropDown.style.display = 'block'
            sortingComments(dropDown);
        }
        else {
            dropDown.style.display = 'none';
        }
    }
});

function sortingComments(dropDown) {
    const imageMark = `<img src="./images/check-mark.svg" alt="Check-Mark" class="selected">`;
    const nameSorting = document.querySelector('.filters');

    dropDown.addEventListener('click', function(event) {
        const target = event.target;
        const indexLi = target.getAttribute('data');

        if (indexLi == 0) {
            insertingImage(target, indexLi);
            nameSorting.innerHTML = 'По дате';
            triangleProcessing(indexLi);
        }
        
        if (indexLi == 1) {
            insertingImage(target, indexLi);
            nameSorting.innerHTML = 'По количеству оценок';
            triangleProcessing(indexLi);
        } 

        if (indexLi == 2) {
            insertingImage(target, indexLi);
            nameSorting.innerHTML = 'По актуальности';
        } 

        if (indexLi == 3) {
            insertingImage(target, indexLi);
            nameSorting.innerHTML = 'По количеству ответов';
        } 

        function insertingImage(target, indexLi) {
            if (target.matches('.drop-down__list--p') || target.matches('.drop-down__list--li')) {
                dropDown.querySelectorAll('.selected').forEach((mark) => {
                  mark.remove();
                });
                
                // Setting the image to the left of the sorting  
                if(target.classList.value === 'drop-down__list--p') {
                    target.parentElement.querySelector('[data="' + indexLi + '"]').insertAdjacentHTML('beforebegin', imageMark); 
                }
                else if (target.classList.value === 'drop-down__list--li') {
                    target.querySelector('[data="' + indexLi + '"]').insertAdjacentHTML('beforebegin', imageMark);
                }
            }
        } 
    }) 
}

function triangleProcessing(indexLi) {
    const commentField = document.querySelector('.comment-field');

    document.querySelector('.triangle').addEventListener('click', function() {
        const target = event.target;
        transformTriangle = !transformTriangle;

        if (transformTriangle) {
            target.style.transform = "rotate(180deg)";

            if (indexLi == 0) {
                commentField.style.flexDirection = 'column';
            } 

            if (indexLi == 1) {
                // Сортируем комментарии по рейтингу в возрастающем порядке
                comments.sort((a, b) => a.rating - b.rating);
                // Очищаем поле комментариев
                commentField.innerHTML = "";
                // Рендерим комментарии в возрастающем порядке рейтинга
                comments.forEach((comment, index) => {
                    commentField.innerHTML += (renderComment(comment, index));
                });
            }
        }

        else if (!transformTriangle) {
            target.style.transform = "rotate(3600deg)";

            if (indexLi == 0) {
                commentField.style.flexDirection = 'column-reverse';
            }

            if (indexLi == 1) {
                // Сортируем комментарии по рейтингу в убывающем порядке
                comments.sort((a, b) => b.rating - a.rating);
                // Очищаем поле комментариев
                commentField.innerHTML = "";
                // Рендерим комментарии в убывающем порядке рейтинга
                comments.forEach((comment, index) => {
                    commentField.innerHTML += (renderComment(comment, index));
                });
            }
        }
    });
}

function renderComment(comment, commentIndex) {
    let out = '';
     
        out += `<div class="static-comment" data-index="${commentIndex}">
            <div class="static-comment__flex">
            <img src="./images/Max.png" alt="Max" class="avatar">
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
                    <p class="favorites">В избранном</p>
                    <img src="./images/Minus.svg" alt="minus" data-parent="${commentIndex}" class="minus-svg">
                    <span class="number-likes">${comment.rating}</span>
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
                <div class="reply-field">${showAnswer(comment.answers, commentIndex)}</div>
    </div>`;
    
  
    return out;
}
