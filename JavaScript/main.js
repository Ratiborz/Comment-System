const commentName = document.querySelector('.comment-name');
const commentBody = document.querySelector('.comment-body');
const button = document.querySelector('.send__btn');
const symbolsLimit = document.querySelector('.writing-comments__info--prohibition');

let comments = [];
loadComments();

document.querySelector('.send__btn').onclick = function() {
    event.preventDefault();
    let comment = {
        name : commentName.textContent,
        body : commentBody.innerText,
        time : Math.floor(Date.now()/1000)
    }
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
}

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
    comments.forEach(function(item) {
        out += `<div class="static-comment">
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
    </div>`;
    });
    commentField.innerHTML = out;
}

function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = String(a.getMinutes()).padStart(2, '0');
    let sec = a.getSeconds();
    let time = `${date}.${month} ${hour}:${min}`;
    return time; 
}

commentBody.addEventListener('input', function() {
    if (commentBody.innerText) {
        button.style.backgroundColor = '#ABD873';
    } else {
        button.style.backgroundColor = ''; 
    } 
    
    symbols = commentBody.innerText.split(' ').join('');
    count = symbols.length;

    if (commentBody.innerText !== '') {
        symbolsLimit.innerHTML = `${count}/1000`;
        symbolsLimit.style.marginLeft = '82px';
    }else {
        symbolsLimit.innerHTML = `Макс. 1000 символов`;
        symbolsLimit.style.marginLeft = '';
    }

    if (count > 1000) {
        symbolsLimit.innerHTML = `${count}/1000 <p class='error-output'>Слишком длинное сообщение</p>`
        symbolsLimit.classList.add('active');
        button.style.backgroundColor = '#A1A1A1';
        button.disabled = true;
        button.style.cursor = 'default';
    }else if (count <= 1000 && count >=1) {
        symbolsLimit.classList.remove('active')
        button.disabled = false;
        button.style.cursor = 'pointer';
    }else if (count <= 0 || Boolean(commentBody.value)) {
        button.disabled = true;
        button.style.cursor = 'default';
    }
});

commentBody.addEventListener('input', function() {
    if (commentBody.textContent.trim().length === 0) {
        commentBody.setAttribute('data-placeholder', 'Введите комментарий');
    } else {
        commentBody.removeAttribute('data-placeholder');
    }
});




