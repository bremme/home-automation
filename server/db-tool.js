

var fs      = require('fs');
// fs.unlinkSync('db/home.db');
var sqlite3 = require('sqlite3').verbose();
var db      = new sqlite3.Database('db/home.db');

console.log('open db: ' + JSON.stringify(db));


// local variables

var locations = [
  'hallway',
  'kitchen',
  'livingroom',
  'studyroom',
  'loft'];
var systemCodes = [];
var receiverCodes = [];
for (var i=0 ; i <  32 ; i++) { systemCodes[i] = i }
for (var i=0 ; i <   5 ; i++) { receiverCodes[i] = String.fromCharCode(65 + i)}

// id, name, location, state, switch_id
devices = [['light', 1, 0 ,156],['light',2,0,157],['light',3,0,158],['light',4,0,159],
  ['moodlight',3,0,160],['Harman Kardon amplifier',3,0,151],['Onkyo amplifier',3,0,152],
  ['light',5,0,153],['moodlight',5,0,154],['monitor',3,0,155]];

console.log('systemCodes: ' + systemCodes);


// object

function DbTool(db) {

};

// intialize the database
DbTool.prototype.init = function(db) {

  db.serialize(function() {

    // CREATE TABLES

    // Create Devices table
    db.run("CREATE TABLE Devices (id INTEGER PRIMARY KEY, name TEXT, location_id TEXT, state INTEGER, switch_id INTEGER)",[],function(err){
      if (err) {
        console.log(err);
      }
    });
    console.log('Created table: Devices');
    // Create Locations table
    db.run("CREATE TABLE Locations (id INTEGER PRIMARY KEY, name TEXT)",[],function(err){
      if (err) {
        console.log(err);
      }
    });
    console.log('Created table: Locations');
    // Create Switches table
    db.run("CREATE TABLE Switches (id INTEGER PRIMARY KEY, switch_table TEXT, switch_id INTEGER)",[],function(err){
      if (err) {
        console.log(err);
      }
    });
    console.log('Created table: Switches');
    // Create Switches brand table (Impuls)
    db.run("CREATE TABLE Switches_impuls (id INTEGER PRIMARY KEY, system_code INTEGER, receiver_code TEXT)",[],function(err){
      if (err) {
        console.log(err);
      }
    });
    console.log('Created table: Switches brand table (Impuls)');

    // INSERT INTO TABLES

    db.run("BEGIN TRANSACTION");
    for (var i=0; i < systemCodes.length; i++) {

      for (var j=0; j < receiverCodes.length; j++) {
        db.run("INSERT INTO Switches_impuls VALUES (NULL,?,?)",
          [systemCodes[i], receiverCodes[j]]);
        db.run("INSERT INTO Switches VALUES (NULL,? , ?)",['switches_impuls', j+1+i*receiverCodes.length ], function(err) {
          if (err) {
            console.log(err);
          }  
        });
      }
    }

    for (var i=0; i < locations.length; i++) {
      db.run("INSERT INTO locations VALUES (NULL,?)",[ locations[i]],function(err){
        if (err) {
          console.log(err)
        }
      })
    }
    for (var i=0; i < devices.length; i++ ){
      db.run("INSERT INTO devices VALUES (NULL, ?, ?, ?, ?)",devices[i][0],devices[i][1],devices[i][2],devices[i][3]);  
    }
    
    db.run("COMMIT");



    db.close();
  })

}

// export the class
// module.exports = DbTool;

var dbtool = new DbTool();

dbtool.init(db);

// module.exports = DbInit;