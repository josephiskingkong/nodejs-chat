const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

let userId;

class Message {
    constructor(userId, text) {
        this.userId = userId;
        this.text = text;
    }
}

class Filter {
    static badWords = ['капец', 'блин', 'дурак'];
    static apply(message) {
        let filteredText = message.text;
        Filter.badWords.forEach(word => {
            const re = new RegExp(word, 'gi');
            filteredText = filteredText.replace(re, (match) => {
                const replacement = match[0] + '*'.repeat(match.length - 1);
                return replacement;
            });
        });

        return new Message(message.userId, filteredText);
    }
}

const handler = {
    set: function(target, property, value) {
        target[property] = Filter.apply(value);
        return true;
    }
};

io.on('connection', socket => {
    socket.on('user.connected', (userId) => {
        socket.userId = userId;
        console.log(userId + ' connected');
    });

    const chat = new Proxy({}, handler);
    socket.on('chat.message', message => {
        const messageInstance = new Message(socket.userId, message);
        chat.message = messageInstance;
        io.emit('chat.message', chat.message);
    });
});



server.listen(3005, () => {
    console.log('Server is running on http://localhost:3005');
});
