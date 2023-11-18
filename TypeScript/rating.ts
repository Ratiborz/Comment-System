import { comments, saveComments, } from './main.js';

type ElementWithParentAndIndex = HTMLElement & {
    dataset: {
        parent: string;
        index: string;
    };
};

export function ratingCount(element: ElementWithParentAndIndex, symbol: string): void {
    let commentIndex = element.dataset.parent;
    let answerIndex = element.dataset.index;
    let rating: number;

    if (!answerIndex) {
        if (symbol === 'plus' && comments[commentIndex].rating < 1) {
            comments[commentIndex].rating += 1;
        } else if (symbol === 'minus' && comments[commentIndex].rating > -1) {
            comments[commentIndex].rating -= 1;
        }
        rating = comments[commentIndex].rating;
    } else {
        if (symbol === 'plus' && comments[commentIndex].answers[answerIndex].rating < 1) {
            comments[commentIndex].answers[answerIndex].rating += 1;
        } else if (symbol === 'minus' && comments[commentIndex].answers[answerIndex].rating > -1) {
            comments[commentIndex].answers[answerIndex].rating -= 1;
        }
        rating = comments[commentIndex].answers[answerIndex].rating;
    }
    
    (element.closest('.commit-actions') as HTMLElement).querySelector('.number-likes')!.innerHTML = rating.toString();
    saveComments();
}