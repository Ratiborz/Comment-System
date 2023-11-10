import {commentName, commentBody, button, symbolsLimit, placeholder,} from './constants.js';
import {handleInput, banImage, banHtmlTag} from './inputProcessing.js';
import {timeConverter, numbOfComments} from './utils.js';
import {ratingCount} from './rating.js';

export let comments = [];
let toggleFavorites = false;
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
    let commentField = document.getElementById('comment-field');
    let out = '';
    comments.forEach(function (item, commentIndex ) {
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
});

function favoritesRegistration(target) {
    const favoritesComment = target.parentNode.parentNode.parentNode.parentNode;
    const favoritesAnswer = target.parentNode.parentNode.parentNode;
    const ParentAnswer = target.parentNode.parentNode.parentNode.parentNode.parentNode;
    const indexAnswerParent = ParentAnswer.getAttribute('data-index');
    const indexComment = favoritesComment.getAttribute('data-index');
    const indexAnswer = favoritesAnswer.getAttribute('data-index'); 

    const imageFavorites = target.parentNode.querySelector('.heart-svg');
    const firstImage = '/images/Only-heart.svg'; 
    const secondImage = '/images/Empty-heart.svg';
    
    if (favoritesComment.classList.value === 'static-comment') {
        if (comments[indexComment].is_favorite === false) {
            comments[indexComment].is_favorite = true;
            imageFavorites.src = firstImage;
        }
        else if (comments[indexComment].is_favorite === true) {
            comments[indexComment].is_favorite = false;
            imageFavorites.src = secondImage;
        }
    }
    else if (favoritesAnswer.classList.value === 'static-comment__reply') {
        if (comments[indexAnswerParent].answers[indexAnswer].is_favorite === false) {
            comments[indexAnswerParent].answers[indexAnswer].is_favorite = true;
            imageFavorites.src = firstImage;
        }
        else if (comments[indexAnswerParent].answers[indexAnswer].is_favorite === true) {
            comments[indexAnswerParent].answers[indexAnswer].is_favorite = false;
            imageFavorites.src = secondImage;
        }
    }
    saveComments();
}

function pasteImageFavorites() {
    const savedComments = JSON.parse(localStorage.getItem('comments'));
    const firstImage = '/images/Only-heart.svg'; 
    const secondImage = '/images/Empty-heart.svg';

    savedComments.forEach(function(comment, index) {
        let commentObj = document.querySelector('[data-index="' + index + '"]');
        const imageFavorites = commentObj.querySelector('.heart-svg');

        if (comment.is_favorite) {
            imageFavorites.src = firstImage;
        }
        else if (!comment.is_favorite) {
            imageFavorites.src = secondImage;
        }
        
        comment.answers.forEach(function(answer, index) {
            let answerObj = commentObj.querySelector('[data-index="' + index + '"]');
            const answerImage = answerObj.querySelector('.heart-svg');

            if (answer.is_favorite) {
                answerImage.src = firstImage;
            }
            else if (!answer.is_favorite) {
                answerImage.src = secondImage;
            }
        }) 
    })
}

function drawFavorites() {
    toggleFavorites = !toggleFavorites; // Переключение состояния

    comments.forEach(function(comment, index) {
        let commentObj = document.querySelector('[data-index="' + index + '"]');
        const staticCommentFlex = commentObj.querySelector('.static-comment__flex');
        const replyField = commentObj.querySelector('.reply-field')

        if (toggleFavorites) {
            if (comment.is_favorite !== true) {
                staticCommentFlex.style.display = 'none';
                replyField.style.marginTop = '0px';
            }
            
            comment.answers.forEach(function(answer, index) {
                let answerObj = commentObj.querySelector('[data-index="' + index + '"]');
                
                if (answer.is_favorite !== true) {
                    answerObj.style.display = 'none';
                }
            })
        } 
        else if (!toggleFavorites) {
            
            staticCommentFlex.style.display = 'flex';
            replyField.style.marginTop = '30px';
            
            comment.answers.forEach(function(answer, index) {
                let answerObj = commentObj.querySelector('[data-index="' + index + '"]');
                answerObj.style.display = 'flex';
            }) 
            
        }
    })
}
