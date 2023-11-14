import { comments, saveComments } from './main.js';
let toggleFavorites = false;

export function favoritesRegistration(target) {
    const favoritesComment = target.parentNode.parentNode.parentNode.parentNode;
    const favoritesAnswer = target.parentNode.parentNode.parentNode;
    const ParentAnswer = target.parentNode.parentNode.parentNode.parentNode.parentNode;
    const indexAnswerParent = ParentAnswer.getAttribute('data-index');
    const indexComment = favoritesComment.getAttribute('data-index');
    const indexAnswer = favoritesAnswer.getAttribute('data-index');

    const imageFavorites = target.parentNode.querySelector('.heart-svg');
    const firstImage = './images/Only-heart.svg';
    const secondImage = './images/Empty-heart.svg';

    if (favoritesComment.classList.value === 'static-comment') {
        if (comments[indexComment].is_favorite === false) {
            comments[indexComment].is_favorite = true;
            imageFavorites.src = firstImage;
        } else if (comments[indexComment].is_favorite === true) {
            comments[indexComment].is_favorite = false;
            imageFavorites.src = secondImage;
        }
    } else if (favoritesAnswer.classList.value === 'static-comment__reply') {
        if (comments[indexAnswerParent].answers[indexAnswer].is_favorite === false) {
            comments[indexAnswerParent].answers[indexAnswer].is_favorite = true;
            imageFavorites.src = firstImage;
        } else if (comments[indexAnswerParent].answers[indexAnswer].is_favorite === true) {
            comments[indexAnswerParent].answers[indexAnswer].is_favorite = false;
            imageFavorites.src = secondImage;
        }
    }
    saveComments();
}

export function pasteImageFavorites() {
    const savedComments = JSON.parse(localStorage.getItem('comments'));
    const firstImage = './images/Only-heart.svg';
    const secondImage = './images/Empty-heart.svg';

    if (savedComments) {
        savedComments.forEach(function (comment, index) {
            let commentObj = document.querySelector('[data-index="' + index + '"]');
            const imageFavorites = commentObj.querySelector('.heart-svg');

            if (comment.is_favorite) {
                imageFavorites.src = firstImage;
            } else if (!comment.is_favorite) {
                imageFavorites.src = secondImage;
            }

            comment.answers.forEach(function (answer, index) {
                let answerObj = commentObj.querySelector('[data-index="' + index + '"]');
                const answerImage = answerObj.querySelector('.heart-svg');

                if (answer.is_favorite) {
                    answerImage.src = firstImage;
                } else if (!answer.is_favorite) {
                    answerImage.src = secondImage;
                }
            });
        });
    }
}

export function drawFavorites() {
    toggleFavorites = !toggleFavorites; // Переключение состояния

    comments.forEach(function (comment, index) {
        let commentObj = document.querySelector('[data-index="' + index + '"]');
        const staticCommentFlex = commentObj.querySelector('.static-comment__flex');
        const replyField = commentObj.querySelector('.reply-field');
        const staticCommentReply = commentObj.querySelectorAll('.static-comment__reply');

        if (toggleFavorites) {
            if (comment.is_favorite !== true) {
                staticCommentFlex.style.display = 'none';
                replyField.style.marginTop = '0px';
                staticCommentReply.forEach((item) => {
                    item.style.marginLeft = '0px';
                });
            }

            comment.answers.forEach(function (answer, index) {
                let answerObj = commentObj.querySelector('[data-index="' + index + '"]');

                if (answer.is_favorite !== true) {
                    answerObj.style.display = 'none';
                }
            });
        } else if (!toggleFavorites) {
            staticCommentFlex.style.display = 'flex';
            replyField.style.marginTop = '30px';
            staticCommentReply.forEach((item) => {
                item.style.marginLeft = '88px';
            });

            comment.answers.forEach(function (answer, index) {
                let answerObj = commentObj.querySelector('[data-index="' + index + '"]');
                answerObj.style.display = 'flex';
            });
        }
    });
}