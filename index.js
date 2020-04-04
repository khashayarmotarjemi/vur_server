var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    setUpPlayer(socket)
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

function setUpPlayer(socket) {
    console.log('new connection to socket');

    socket.on('move', function (args) {
        movePlayer(args)
    })

    socket.on('new_player', function (args) {
        handleNewPlayerSetup(args)
    })


    setInterval(function () {
        socket.emit('state', JSON.stringify(players))
        console.log(players)
    }, 100)
}



function handleNewPlayerSetup(args) {
    console.log('adding player: ' + args)

    let player = getPlayer(args)

    players.findIndex(p => p.id == player.id) === -1 ? players.push(player) : NaN
    console.log("players list: " + players)
}

function movePlayer(args) {
    console.log('new move event: ' + args)

    let newPlayerState = getPlayer(args)
    let oldPlayerState = players.find(player => player.id == newPlayerState.id)

    let xDist = newPlayerState.x - oldPlayerState.x
    let yDist = newPlayerState.y - oldPlayerState.y

    let distance = Math.sqrt(xDist * xDist + yDist * yDist)

    let times = Math.floor(distance/100)

    let xInterval = xDist / times
    let yInterval = yDist / times

    console.log('x interval: ' + xInterval + ' times ' + times)

    for (const i of Array(times).keys()) {

        setTimeout(function () {
            updatePlayer({
                x: oldPlayerState.x + xInterval * i,
                y: oldPlayerState.y + yInterval * i,
                id: oldPlayerState.id
            })
        }, 100 * i);
    }


    // updatePlayer(newPlayerState)
}

function updatePlayer(newPlayer) {
    let index = players.findIndex(player => player.id == newPlayer.id);
    players = players.fill(newPlayer, 0, 1);
}

players = []

function getPlayer(args) {
    return JSON.parse(args)
}
