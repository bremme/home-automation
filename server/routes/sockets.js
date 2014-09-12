

var db   = require('../db-con.js');

// Constructor method
function SocketsHandler() {

}

// class methods

// listen for socket events
SocketsHandler.prototype.listen = function(socket) {

  // INITIALISATION ////////////////////////////////////////////////////////////

  console.log('a client connected with id: ' + socket.id);

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
      console.log('init:switch: sending current state of switches to ' + socket.id); 
    }      
  });

  // get climate state from database 
  db.all("SELECT * FROM v_ClimateState", function(err,rows) {
    if (err) {
      console.log(err);
    } else {
      socket.emit('init:climate', rows);
      console.log('init:switch: sending current state of climate to ' + socket.id); 
    }
  })
 
  
  // EVENTS ////////////////////////////////////////////////////////////////////
 
  // PUT - Update switch state
  socket.on('change:switch', function(aSwitch, callback) {


    console.log('change:switch: ' + JSON.stringify(aSwitch) + ' by ' + socket.id);

    // set new state of swtich (hardware)

    // store new state of switch in database
    db.run("UPDATE devices SET state=? WHERE id=?", [aSwitch.devState, aSwitch.devId], function(err) {

      if(err) {
        console.log('change:switch: an error occured while writing to the db');
        // log error on server
        console.log(err);
        // send error to client
        callback(err)
      } else {

        socket.broadcast.emit('change:switch', aSwitch )
        console.log('change:switch: update to db succesfull, broadcasting to other clients');
      }
    });
  })

  // PUT - Update climate state
  socket.on('change:climate', function(data, callback ) {

    console.log('change:climate: ' + JSON.stringify(data) + ' by ' + socket.id);

    // find out which parameter is set
    // curTemp, setTemp, heaterOn, climateProgramId


    var keys = Object.keys(data)
    var nrOfKeys = keys.length;

    db.run("BEGIN TRANSACTION");

    keys.forEach( function(key) {

      db.run("UPDATE ClimateState SET " + key + "=?",[data[key]], function(err) {

        if (err) {
          callback(err);
          db.run("ROLLBACK");
          return
        }
        if (nrOfKeys -= 1 === 0 )
          db.run("COMMIT")
          callback();
      })

    });


    // db.run("BEGIN TRANSACTION")


    // for (var key in data) {

    //   db.run("UPDATE ClimateState SET " + key + "=?",[data[key]], function(err) {

    //     if (err) {
    //       console.log('change:climate: an error occured while writing to the db');
    //       console.log(err);          
    //       return err;
    //     }
    //   });
    // }

    // db.run("COMMIT");
    
    // if (err) {
    //   callback(err)
    // } else {
    //   socket.broadcast.emit('change:climate', data)
    //   callback();
    //   console.log('change:climate: update to db succesfull, broadcasting to other clients');
    // }    

  });


  socket.on('disconnect', function(socket) {
    console.log('a client disconnected ' + socket.id );
  })

}


module.exports = SocketsHandler;



