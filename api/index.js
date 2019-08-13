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
    game.addNewUser(data.form, id);
    
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
    console.log('userHit');
  });
  socket.on('userDouble', (data) => {
    console.log('userDouble');
  });
  socket.on('userSplit', (data) => {
    console.log('userSplit');
  });
  socket.on('userHold', (data) => {
    console.log('userHold');
  });

  socket.on("disconnect", function() {
      console.log('disconnect');
  })

  var bettingTimeEnded = () => {
    console.log('TIMEOUT!');
    timer = null;
    io.emit('gamephasechange', 'dealingCards');
    game.dealCards(io)
    // game.drawCard();
  }

});

http.listen(3000, function(){
  console.log('listening on port 3000');
});