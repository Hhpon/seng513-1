$(function() {
    let socket = io();

    socket.on('connected', (name) => {
        document.cookie = "name=" + name;
        console.log(name);
    });
    

    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg));
    });

});
