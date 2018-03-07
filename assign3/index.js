// Simple chat application starting code taken from
// https://github.com/socketio/socket.io/tree/master/examples/chat

let secret = "secret-cat";
let express = require('express');
let session = require('express-session')({
    secret: secret,
    resave: true,
    saveUninitialized: true
});
let sharedSession = require('express-socket.io-session');
let app = express();
let path = require('path');
let server = require('http').createServer(app);
let cookie = require('cookie');
let cookieParser = require('cookie-parser');
let io = require('socket.io')(server);
const port = 51900;

// serve static files using absolute path
app.use(express.static(path.join(__dirname, 'public')));

// attach session
app.use(session);

// share session with io sockets
// source: https://www.npmjs.com/package/express-socket.io-session
io.use(sharedSession(session, {
    autoSave: true
}));


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

// 77 animal names
const ANIMALS = shuffle([
    "Alligator", "Anteater", "Armadillo", "Auroch", "Axolotl",
    "Badger", "Bat", "Beaver", "Buffalo",
    "Camel", "Chameleon", "Cheetah", "Chipmunk", "Chinchilla", "Chupacabra", "Cormorant", "Coyote", "Crow",
    "Dingo", "Dinosaur", "Dog", "Dolphin", "Dragon", "Duck", "Dumbo Octopus",
    "Elephant",
    "Ferret", "Fox", "Frog",
    "Giraffe", "Goose", "Gopher", "Grizzly",
    "Hamster", "Hedgehog", "Hippo", "Hyena",
    "Jackal",
    "Ibex", "Ifrit", "Iguana",
    "Kangaroo", "Koala", "Kraken",
    "Lemur", "Leopard", "Liger", "Lion", "Llama",
    "Manatee", "Mink", "Monkey", "Moose",
    "Narwhal", "Nyan Cat",
    "Orangutan", "Otter",
    "Panda", "Penguin", "Platypus", "Python", "Pumpkin",
    "Quagga",
    "Rabbit", "Raccoon", "Rhino",
    "Sheep", "Shrew", "Skunk", "Slow Loris", "Squirrel",
    "Tiger", "Turtle",
    "Unicorn",
    "Walrus", "Wolf", "Wolverine", "Wombat"
].map(x => "Anonymous " + x));

// 64 colors
const COLORS = shuffle([
    "#000000", "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
    "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
    "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
    "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
    "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
    "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
    "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
    "#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
    "#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
    "#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
    "#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
    "#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
    "#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C"
]);

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

const maxUsers = Math.min(ANIMALS.length, COLORS.length);
let colorIndex = 0;
let animalIndex = 0;
let userIndex = 0;
let connectedUsers = {};


io.on('connection', (socket) => {

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

        // create a new one if that fails
    } catch (e) {
        user = new User();
        console.log(user.name + " joined");
    }

    // save user data in a cookie
    socket.emit('connected', user);


    socket.on('chat message', (msg) => {
        console.log(user.name + ": " + msg);
        io.emit('chat message', msg);
    });


    socket.on('disconnect', () => {
        user.deactivate();
        console.log(user.name + " has left");
    });
});


// listen for new connections
server.listen(port, () => {
    console.log('listening on *:' + port);
});