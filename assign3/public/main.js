$(function() {
    let socket = io();
    let id = null;

    function update(userData) {
        // update cookie
        document.cookie = "id=" + userData.id;
        document.cookie = "name=" + userData.name;
        document.cookie = "color=" + userData.color;

        // update client state
        id = userData.id;
    };

    socket.on('connected', (userData) => {
        update(userData);
        console.log(userData.name + " is connected");
    });
    

    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        console.log(msg);

        let date = new Date(msg.time);
        let time = date.getHours() + ':' + ('0' + date.getMinutes()).substr(-2);
        let uname = $('<span>').text(msg.uname).css("color", msg.color);


        let li = $('<li>');
        li.append(time + " ");
        li.append(uname);
        li.append(": " + msg.txt);
        if (msg.uid == id) {
            li.wrapInner('<b>');
        }

        $('#messages').append(li);
    });

});
