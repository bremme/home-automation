

var db   = require('../db-con.js');

// Constructor method
function SocketsHandler(db,io) {
  // store db connection 
  this.db = db; // public property
  this.io = io  
}

// class methods

// listen for socket events
SocketsHandler.prototype.listen = function(socket) {

  console.log(db)



  console.log('a client connected: ' + socket.id);

  // Send (initial) system state

  // get switches state from database
  db
 
  // PUT - Update switch state
  socket.on('change:switch', function(data, callback) {


    console.log('send data: ' + JSON.stringify(data) );

    // set new state of swtich (hardware)

    // store new state of switch in database

    // confirm succesfull change of switch state

    var res = {msg:'succes',info:'Succesfully change state of switch'};

    // callback(err);

  })


  socket.on('disconnect', function(socket) {
    console.log('a client disconnected ' + socket.id );
  })

}


module.exports = SocketsHandler;



