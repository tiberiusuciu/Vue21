var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var Game = require('./engine/Game.js');

var game = new Game(8);
var id = 0;
var timer;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  // letting the client know his own socket id
  socket.emit("socketid", socket.id);

  socket.on('newUser', (data) => {
    game.addNewUser(data.form, id, socket.id);
    
    socket.to(data.socketId).emit('playerinfo', id);
    io.emit('users', game.users);
    
    id++;
  });

  socket.on('userbet', (data) => {
    // Locate player & apply changes
    game.playerBet(data.bettingAmount, data.id);
    
    // start timer
    if (timer) {
      clearTimeout(timer);
    }
    io.emit('gamebegintimer', 5);
    io.emit('gamephasechange', 'aboutToStart');
    timer = setTimeout(bettingTimeEnded, 5000);
    
    // notify everyone
    io.emit('users', game.users);
    
  });

  socket.on('userHit', (data) => {
    game.playerHit(data.id, io);
  });
  socket.on('userDouble', (data) => {
    game.playerDouble(data.id, io);
  });
  socket.on('userSplit', (data) => {
    game.playerSplit(data.id, io);
  });
  socket.on('userHold', (data) => {
    game.playerHold(data.id, io);
  });

  socket.on('userAnswer', (data) => {
    game.userAnswer(data.id, data.answer);
  });

  socket.on("disconnect", () => {
    console.log('btw, here is socket id', socket.id);
    
    game.removePlayer(io, socket.id);
    console.log('disconnect');
  })

  var bettingTimeEnded = () => {
    timer = null;
    io.emit('gamephasechange', 'dealingCards');
    game.dealCards(io)
    // game.drawCard();
  }

});

http.listen(3000, function(){
  console.log('listening on port 3000');
});