// Simple chat application starting code taken from
// https://github.com/socketio/socket.io/tree/master/examples/chat

let express = require('express');
let app = express();
let path = require('path');
let http = require('http').createServer(app);
let cookie = require('cookie');
let io = require('socket.io')(http);
const port = 51900;

// serve static files using absolute path
app.use(express.static(path.join(__dirname, 'public')));

// Fisher–Yates array shuffle algorithm
// source: https://bost.ocks.org/mike/shuffle/
function shuffle(arr) {
    let i = arr.length, temp, r;
    while (i) {
        r = Math.floor(Math.random() * i--);
        temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
    return arr;
}

// 78 animal names
// source: https://www.quora.com/What-is-the-complete-list-of-anonymous-creatures-one-can-be-labeled-as-when-using-Google-Docs
const ANIMALS = shuffle([
    "Alligator", "Anteater", "Armadillo", "Auroch", "Axolotl", "Badger", "Bat", "Beaver", "Buffalo", "Camel", "Chameleon", "Cheetah", "Chipmunk", "Chinchilla", "Chupacabra", "Cormorant", "Coyote", "Crow", "Dingo",
    "Dinosaur", "Dog", "Dolphin", "Dragon", "Duck", "Dumbo Octopus", "Elephant", "Ferret", "Fox", "Frog", "Giraffe", "Goose", "Gopher", "Grizzly", "Hamster", "Hedgehog", "Hippo", "Hyena", "Jackal",
    "Ibex", "Ifrit", "Iguana", "Kangaroo", "Koala", "Kraken", "Lemur", "Leopard", "Liger", "Lion", "Llama", "Manatee", "Mink", "Monkey", "Moose", "Narwhal", "Nyan Cat", "Orangutan", "Otter",
    "Panda", "Penguin", "Platypus", "Python", "Pumpkin", "Quagga", "Rabbit", "Raccoon", "Rhino", "Sheep", "Shrew", "Skunk", "Slow Loris", "Squirrel", "Tiger", "Turtle", "Unicorn", "Walrus", "Wolf",
    "Wolverine", "Wombat"
].map(x => "Anonymous " + x));

// 76 material design colors
// source: https://www.materialui.co/colors
const COLORS = shuffle([
    "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9", "#DCEDC8", "#F0F4C3", "#FFF9C4", "#FFECB3", "#FFE0B2", "#FFCCBC", "#D7CCC8", "#F5F5F5", "#CFD8DC",
    "#EF9A9A", "#F48FB1", "#CE93D8", "#B39DDB", "#9FA8DA", "#90CAF9", "#81D4FA", "#80DEEA", "#80CBC4", "#A5D6A7", "#C5E1A5", "#E6EE9C", "#FFF59D", "#FFE082", "#FFCC80", "#FFAB91", "#BCAAA4", "#EEEEEE", "#B0BEC5",
    "#E57373", "#F06292", "#BA68C8", "#9575CD", "#7986CB", "#64B5F6", "#4FC3F7", "#4DD0E1", "#4DB6AC", "#81C784", "#AED581", "#DCE775", "#FFF176", "#FFD54F", "#FFB74D", "#FF8A65", "#A1887F", "#E0E0E0", "#90A4AE"
    // "#EF5350", "#EC407A", "#AB47BC", "#7E57C2", "#5C6BC0", "#42A5F5", "#29B6F6", "#26C6DA", "#26A69A", "#66BB6A", "#9CCC65", "#D4E157", "#FFEE58", "#FFCA28", "#FFA726", "#FF7043", "#8D6E63", "#BDBDBD", "#78909C"
]);



// const COLORS = shuffle([
//     "#000000", "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
//     "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
//     "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
//     "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
//     "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
//     "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
//     "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
//     "#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
//     "#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
//     "#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
//     "#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
//     "#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
//     "#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C"
// ]);

class User {
    constructor(id, name, color) {
        this.id = id || userIndex++;

        // set unique random name
        do {
            if (name) {
                this.name = name;
            } else {
                this.name = ANIMALS[animalIndex];
                animalIndex = (animalIndex + 1) % ANIMALS.length;
            }
            name = "";
        }
        while (this.name in Object.keys(connectedUsers));

        this.color = color || COLORS[colorIndex++];
        colorIndex = (colorIndex + 1) % COLORS.length;
        
        connectedUsers[this.name] = this;
        return this;
    }

    changeName(name) {
        if (!(name in Object.keys(connectedUsers))) {
            // update entry and change name
            delete connectedUsers[this.name];
            this.name = name;
            connectedUsers[this.name] = this;
        }
    }

    deactivate() {
        delete connectedUsers[this.name];
    }
}

class Message {
    constructor(txt, user) {
        this.txt = txt;
        this.color = user.color;
        this.uname = user.name;
        this.uid = user.id;
        this.time = Date.now();
        console.log(new Date(this.time).toTimeString());
    }
}
Message.prototype.toString = function() {
    return '[' + this.time + '] ' + this.color + ' ' + this.uname + ': ' + this.txt;
    // return '[' + this.time + '] ' + this.uname + ': ' + this.txt; 
}

const maxUsers = Math.min(ANIMALS.length, COLORS.length);
let colorIndex = 0;
let animalIndex = 0;
let userIndex = 0;
let connectedUsers = {};


io.on('connection', (socket) => {

    // connect
    let user;
    try {
        // try to restore existing user
        cookieData = cookie.parse(socket.request.headers.cookie);
        user = new User(
            cookieData.id,
            cookieData.name,
            cookieData.color
        );
        let reactivated = (user.name == cookieData.name);
        console.log(user.name + (reactivated ? " has returned!" : " joined"));

    } catch (e) {
        // create a new one if that fails
        user = new User();
        console.log(user.name + " joined");
    }

    // save user data in a cookie
    socket.emit('connected', user);

    // receive message
    socket.on('chat message', (txt) => {
        msg = new Message(txt, user);
        console.log(msg.toString());
        io.emit('chat message', msg);
    });

    // disconnect
    socket.on('disconnect', () => {
        user.deactivate();
        console.log(user.name + " has left");
    });
});


// listen for new connections
http.listen(port, () => {
    console.log('listening on *:' + port);
});