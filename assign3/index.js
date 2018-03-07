// Sample chat application code taken from
// https://socket.io/get-started/chat/

let express = require('express');
let app = express();
let path = require('path');
let http = require('http').Server(app);
let io = require('socket.io')(http);
const port = 51900;

// listen for new connections
http.listen(port, () => {
    console.log('listening on *:' + port);
});

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

// 77 animal names
let animals = [
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
];

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
    constructor(name) {
        this.animalName = name;
        this.name = "Anonymous " + name;
        this.color = COLORS[colorIndex];
        usedNames.add(this.name);
        colorIndex = (colorIndex + 1) % COLORS.length;
        connectedUsers.add(this);
        return this.name;
    }

    restoreAnimalName() {
        // only restore it once
        if ("Anonymous " + this.animalName === this.name) {
            console.log("Restoring " + this.animalName + "...");    // DEBUG
            animals.push(this.animalName);
            this.animalName = null;
        }
    }

    changeName(name) {
        // only change name if unique and non-empty
        if ((name || name === '0') && !usedNames.has(name)) {
            this.restoreAnimalName();
            usedNames.delete(this.name);
            this.name = name;
            usedNames.add(this.name);
        }
    }

    remove() {
        this.restoreAnimalName();
        usedNames.delete(this.name);
        connectedUsers.delete(this);
        return this;
    }
}

const maxUsers = Math.min(animals.length, COLORS.length);
let colorIndex = 0;
let connectedUsers = new Set();
let usedNames = new Set();

// select a random animal name and remove it from animals list
function getRandomAnimal() {
    return animals.splice(Math.floor(Math.random() * animals.length), 1)[0];
};

io.on('connection', (socket) => {
    console.log(new User(getRandomAnimal()).name + " connected");

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });


    socket.on('disconnect', () => {

        //
        // TODO: on user exiting, restore animal name to the list.
        //       you need to know which user left in order to do this!
        //       ...just call <user>.remove()
        //


        console.log('user disconnected');
    });
});
