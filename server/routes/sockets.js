

var db   = require('../db-con.js');

// Constructor method
function SocketsHandler(db,io) {

}

// class methods

// listen for socket events
SocketsHandler.prototype.listen = function(socket) {

  // INITIALISATION ////////////////////////////////////////////////////////////

  console.log('a client connected: ' + socket.id);

  // Send (initial) system state

  var data = {};

  // get switches state from database
  db.all("SELECT * FROM v_devices",function(err,rows) {

    // convert data to appropriate formate
    // data.<device_type>.<location_name>.<dev_name_short> = <state_string>
    // data.livingroom.moodligh = 'on'
    // data.loft.light = "on"
    if (err) {
      console.log(err)
    } else {

      socket.emit('init:switch', rows);

    }      
  });

  // get climate state from database 
  db.all("SELECT * FROM v_climate_state", function(err,rows) {
    if (err) {
      console.log(err);
    } else {
      socket.emit('init:climate', rows);
    }
  })
 
  
  // EVENTS ////////////////////////////////////////////////////////////////////
 
  // PUT - Update switch state
  socket.on('change:switch', function(aSwitch, callback) {


    console.log('change:switch: ' + JSON.stringify(aSwitch) );

    // set new state of swtich (hardware)

    // store new state of switch in database
    db.run("UPDATE devices SET state=? WHERE id=?", [aSwitch.devState, aSwitch.devId], function(err) {

      if(err) {
        // log error on server
        console.log(err);
        // send error to client
        callback(err)
      } else {

        socket.broadcast.emit('change:switch', aSwitch )

      }
    });
  })

  // PUT - Update climate state
  socket.on('change:climate', function(data, callback ) {

    // find out which parameter is set
    // curTemp, setTemp, heaterOn, climateProgramId

    db.run("BEGIN TRANSACTION")

    for (key in data) {

      value = data[key];

      db.run("UPDATE climate_state SET " + key + "=?",[value], function(err) {

        if (err) {
          console.log(err);          
          return err;
        }
      });
    }
    db.run("COMMIT");

    socket.broadcast.emit('change:climate', data)

  });


  socket.on('disconnect', function(socket) {
    console.log('a client disconnected ' + socket.id );
  })

}


module.exports = SocketsHandler;



