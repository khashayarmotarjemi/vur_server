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
    console.log('a player joined');

    let player = {
        'id': socket.id,
        // 'socket': socket,
        'xLocation': 200,
        'yLocation': 200,
    }

    socket.on('move', function (args) {
        player.xLocation = args[0]
        player.yLocation = args[1]
    })


    players.indexOf(player) === -1 ? players.push(player) : NaN

    setInterval(function () {
        socket.emit('state' , player)
    }, 3000)
}



var players = []