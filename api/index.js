var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var Game = require('./engine/Game.js');

var game = new Game();
var id = 0;

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
    console.log('we have a bet', data);

    // Locate player
    // apply changes
    // start timer
    // notify everyone
    
  });

  socket.on("disconnect", function() {
      console.log('disconnect');
  })

});

http.listen(3000, function(){
  console.log('listening on port 3000');
});