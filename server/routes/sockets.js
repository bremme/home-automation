

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
      //     // confirm succesfull change of switch state
      //     db.all("SELECT * FROM v_devices WHERE devId=?",[data.devId], function(err,rows) {

      //       if ( !err ) {
      //         var sw = {};
      //         sw.id = rows[0].dev_id;
      //         sw.state = rows[0].dev_state;
      //         sw.location = rows[0].dev_loc;
      //         sw.nameShort = rows[0].dev_name_short;
      //         console.log(sw)
      //         // send changed switch state to other clients
      //         socket.broadcast.emit('change:switch', sw)
      //       }

      //     })
          

      //     // var res = {msg:'succes',info:'Succesfully change state of switch'};

      //     // callback(err);

      }
    });



  })


  socket.on('disconnect', function(socket) {
    console.log('a client disconnected ' + socket.id );
  })

}


module.exports = SocketsHandler;



