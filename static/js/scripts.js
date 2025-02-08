// Function random animated stars
function createStars() {
    for (let i = 0; i < 1000; i++) {
        let star = document.createElement('div');
        star.className = 'star';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDuration = Math.random() * 2 + 0.75 + 's';
        star.style.zIndex = '1';
        document.body.appendChild(star);
    }
}

// Function user input & update chat box
const sendMessage = (button) => {
    let input = document.getElementById('user-input').value;
    if (input.trim() !== '') {
        let newMessage = document.createElement('div');
        newMessage.classList.add('message-box');
        newMessage.textContent = input;
        document.getElementById('chat-box').appendChild(newMessage);
        document.getElementById('user-input').value = '';
        document.getElementById('user-input').focus();        
    }
};
