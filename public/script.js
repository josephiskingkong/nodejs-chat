let userId;
let socket; 

const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const confirmUserIdButton = document.getElementById('confirm-user-id')
const modalBackground = document.getElementById('modal-background');


confirmUserIdButton.onclick = function() {
    userId = document.getElementById('user-id').value;
    socket = io();
    socket.emit('user.connected', userId);
    

    document.getElementById('send').onclick = function() {
        const message = document.getElementById('input').value;
        socket.emit('chat.message', { userId: userId, text: message });
        document.getElementById('input').value = '';
    };

    socket.on('chat.message', function(message) {
        if (message.userId !== userId) {
        const userIdDiv = document.createElement('div');
        userIdDiv.textContent = message.userId;
        userIdDiv.className = 'userId';
        document.getElementById('messages').appendChild(userIdDiv);
        }
    
        const messageTextDiv = document.createElement('div');
        messageTextDiv.className = 'message ' + (message.userId === userId ? 'current-user' : 'other-user');
        messageTextDiv.textContent = message.text;
        document.getElementById('messages').appendChild(messageTextDiv);
    });

    modalBackground.style.display = 'none'; 
};

const sendMessage = function() {
    const message = input.value;
    socket.emit('chat.message', message);
    input.value = '';
};

sendButton.onclick = sendMessage;

input.onkeydown = function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
};

socket.on('user.id', function(id) {
    userId = id;
});