

var db   = require('../db-con.js');
console.log('dbcon ' + JSON.stringify(db))

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
  // console.log(this.db)
  // Send system state
  // console.log(socket)
  // get switches state from database

 
  // PUT - Update switch state
  socket.on('change:switch', function(data, callback) {

    // test db connection
    db.each("SELECT name FROM locations LIMIT 1",function(err,row) {
      console.log(row.name);
    });
    console.log(this.io)

    console.log('send data: ' + JSON.stringify(data) );

    // set new state of swtich (hardware)

    // store new state of switch in database

    // confirm succesfull change of switch state

    var res = {msg:'succes',info:'Succesfully change state of switch'};

    callback(res);

  })


  socket.on('disconnect', function(socket) {
    console.log('a client disconnected ' + socket.id );
  })

}


module.exports = SocketsHandler;



