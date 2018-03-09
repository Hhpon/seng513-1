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
        $('#username').text(userData.name);
    };

    socket.on('connected', (userData) => {
        update(userData);
        $('.messages.content').empty();
        $('.messages.content').append($('<li>').text("You are " + userData.name + "."));
        console.log(userData.name + " is connected");
    });
    

    $('form').submit( () => {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', (msg) => {
        console.log(msg);

        let date = new Date(msg.time);
        let time = ('0' + date.getHours()).substr(-2) + ':' + ('0' + date.getMinutes()).substr(-2);
        let uname = $('<span>').text(msg.uname).css("color", msg.color);


        let li = $('<li>');
        li.append(time + " ");
        li.append(uname);
        li.append(": " + msg.txt);
        if (msg.uid == id) {
            li.wrapInner('<b>');
        }

        $('.messages.content').append(li);
        $('.messages.content').scrollTop($('.messages.content')[0].scrollHeight);
    });

    socket.on('update users', (users) => {
        $('.users.content').empty();
        for (u of users) {
            $('.users.content').append($('<li>').text(u));
        }
    });

});
