const io = require("socket.io");
const server = io.listen(3000);

var Game = require('./engine/Game.js');


var game = new Game();
var id = 0;

server.on("connection", function(socket) {
  console.log("user connected");

  socket.emit("welcome", "welcome man");

  socket.on('newUser', function(data) {
    console.log(data);
    
  });

  socket.on("disconnect", function() {
      console.log('disconnection?');
  })
});
