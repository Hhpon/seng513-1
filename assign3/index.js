// Sample chat application code taken from
// https://socket.io/get-started/chat/

let express = require('express');
let app = express();
let path = require('path');
let http = require('http').Server(app);
let io = require('socket.io')(http);
const port = 51900;

http.listen(port, () => {
    console.log('listening on *:' + port);
});

// set static files using absolute path
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });


    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});
