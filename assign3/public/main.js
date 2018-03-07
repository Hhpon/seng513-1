$(function() {
    let socket = io();

    function updateCookie(userData) {
        document.cookie = "id=" + userData.id;
        document.cookie = "name=" + userData.name;
        document.cookie = "color=" + userData.color;
    };

    socket.on('connected', (userData) => {
        updateCookie(userData);
        console.log(userData.name + " is connected");
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
