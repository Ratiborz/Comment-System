import {comments, saveComments} from './main.js';

export function ratingCount(element, symbol) {
    let commentIndex = element.getAttribute('data-parent');
    let answerIndex = element.getAttribute('data-index');
    let rating;

    if (!answerIndex) {
        if (symbol === 'plus' && comments[commentIndex].rating < 1) {
            comments[commentIndex].rating += 1;
        } 
        else if (symbol === 'minus' && comments[commentIndex].rating > -1) {
            comments[commentIndex].rating -= 1;            
        }
        rating = comments[commentIndex].rating;
    } else {
        if (symbol === 'plus' && comments[commentIndex].answers[answerIndex].rating < 1) {
            comments[commentIndex].answers[answerIndex].rating += 1;
        }
        else if (symbol === 'minus' && comments[commentIndex].answers[answerIndex].rating > -1) {
            comments[commentIndex].answers[answerIndex].rating -= 1;
        }
        rating = comments[commentIndex].answers[answerIndex].rating;
    }
    element.closest('.commit-actions').querySelector('.number-likes').innerHTML = rating
    saveComments();
}