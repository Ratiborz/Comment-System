import {commentName, commentBody, button, symbolsLimit, placeholder, commitNickname, replyNickname,} from './constants.js';

let commitReply;
let comments = [];
let answers = []; 
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
    placeholder.style.display = 'block';
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
    </div>`;
    });
    commentField.innerHTML = out;
    commitReply = document.querySelectorAll('.commit-reply');
    console.log('работает')
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
    let symbols = commentBody.innerText.replace(/\s/g, '');
    let count = symbols.length;

    if (count) {
        button.style.backgroundColor = '#ABD873';
    } else {
        button.style.backgroundColor = ''; 
    } 
    
    if (count) {
        symbolsLimit.innerHTML = `${count}/1000`;
        symbolsLimit.style.marginLeft = '82px';
        placeholder.style.display = 'none';
    }else {
        symbolsLimit.innerHTML = `Макс. 1000 символов`;
        symbolsLimit.style.marginLeft = '';
        placeholder.style.display = 'block';
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
    }else if (count <= 0) {
        button.disabled = true;
        button.style.cursor = 'default';
    }
});

commentBody.addEventListener("paste", (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;

    if (clipboardData) {
      // Проверяем, есть ли изображение в буфере обмена
      if (clipboardData.types && clipboardData.types.includes("Files")) {
        // Отменяем вставку изображений
        event.preventDefault();
        alert("Вставка изображений запрещена.");
      }
    }
});

commentBody.addEventListener("paste", function(event) {
    event.preventDefault();
    let text = event.clipboardData.getData("text/plain");
    let strippedText = text.replace(/(<([^>]+)>)/gi, "");
    document.execCommand("insertHTML", false, strippedText);
});

/*function showInput() {
    let out = `<div class="text_btn writing-answers">
                <div class="comment-body" tabindex="0" contenteditable="true" role="textbox" aria-multiline="true">
        
                </div>
                <div class="placeholder">
                    <div class="ph_input">
                        <div class="ph_content">Введите текст сообщения...</div>
                    </div>
                </div>
                <button class="send__btn" disabled>Отправить</button>
            </div>`
}*/

commitReply.forEach(button => {

    button.addEventListener('click', function() {
        let answer = {
            name : commitNickname.innerText,
            replyNickname : replyNickname.innerText,
        }
        answers.push(answer);
        
        console.log(answers); 
    }) 
})

