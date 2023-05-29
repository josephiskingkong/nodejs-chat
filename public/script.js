let userId;
let socket;

const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const confirmUserIdButton = document.getElementById('confirm-user-id')
const modalBackground = document.getElementById('modal-background');
const error = document.getElementById('error');

const sendMessage = async function () {
    let message = input.value;
    message = message.trimStart();
    message = message.trimEnd();
    if (message === '') {
        return;
    } 
    await socket.emit('chat.message', message);
    input.value = '';
};

document.getElementById('user-id').onclick = function () {
    error.classList.add('hidden');
}

function connect() {
    userId = document.getElementById('user-id').value;
    userId = userId.trimStart();
    if (userId === '' || userId.length > 20 || userId.length < 3) {
        error.classList.remove('hidden');
                return;
    }
    socket = io();
    socket.emit('user.connected', userId);

    sendButton.onclick = async function () {
        sendMessage();
    };

    input.onkeydown = function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    socket.on('chat.message', function (message) {
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

    socket.on('user.connected', function (userId) {
        const connectionDiv = document.createElement('div');
        connectionDiv.className = 'connection';
        connectionDiv.textContent = userId + ' присоединился к чату';
        document.getElementById('messages').appendChild(connectionDiv);
    })

    socket.on('user.disconnected', function (userId) {
        const connectionDiv = document.createElement('div');
        connectionDiv.className = 'connection';
        connectionDiv.textContent = userId + ' вышел из чата';
        document.getElementById('messages').appendChild(connectionDiv);
    })

    socket.on('user.id', function (id) {
        userId = id;
    });

    modalBackground.style.display = 'none';
}

confirmUserIdButton.onclick = function () {
    connect();
};

document.getElementById('user-id').onkeydown = function (event) {
    if (event.key === 'Enter') {
        connect();
    }
};