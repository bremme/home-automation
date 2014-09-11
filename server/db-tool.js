

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
    // Create Locations table
    db.run("CREATE TABLE locations (id INTEGER PRIMARY KEY, name TEXT)",[],function(err){
      if (err) {
        console.log(err);
      }
    });
    console.log('Created table: Locations');

    db.run("CREATE TABLE switch_brands (id INTEGER PRIMARY KEY, name TEXT )",[],function(err){
      if (err) {
        console.log(err);
      }
    });

    // Create Switches table
    db.run("CREATE TABLE switches (id INTEGER PRIMARY KEY, switch_brand_id INTEGER, properties_json TEXT, FOREIGN KEY(switch_brand_id) REFERENCES switch_brands(id) )",[],function(err){
      if (err) {
        console.log(err);
      }
    });
    console.log('Created table: Switches');
    // Create Devices table
    db.run("CREATE TABLE devices ( id INTEGER PRIMARY KEY, name TEXT, location_id INTEGER, state INTEGER, switch_id INTEGER, FOREIGN KEY(location_id) REFERENCES locations(id), FOREIGN KEY(switch_id) REFERENCES switches(id) )",[],function(err){
      if (err) {
        console.log(err);
      }
    });
    console.log('Created table: Devices');
    
    // // Create Switches brand table (Impuls)
    // db.run("CREATE TABLE Switches_impuls (id INTEGER PRIMARY KEY, system_code INTEGER, receiver_code TEXT)",[],function(err){
    //   if (err) {
    //     console.log(err);
    //   }
    // });
    // console.log('Created table: Switches brand table (Impuls)');

    // INSERT INTO TABLES



    db.run("BEGIN TRANSACTION");

    for (var i=0; i < locations.length; i++) {
      db.run("INSERT INTO locations VALUES (NULL,?)",[ locations[i]],function(err){
        if (err) {
          console.log(err)
        }
      })
    }

    db.run("INSERT INTO switch_brands VALUES (NULL,?)", "Impulse");


    var switchProp = '';

    for (var i=0; i < systemCodes.length; i++) {

      for (var j=0; j < receiverCodes.length; j++) {
        // db.run("INSERT INTO Switches_impuls VALUES (NULL,?,?)",
        //   [systemCodes[i], receiverCodes[j]]);

      
        switchProp = '{"systemCode":' + systemCodes[i] + ',"receiverCode":"'  + receiverCodes[j] + '"}';

        db.run("INSERT INTO Switches VALUES (NULL,? , ?)",[1, switchProp ], function(err) {
          if (err) {
            console.log(err);
          }  
        });
      }
    }


    for (var i=0; i < devices.length; i++ ){
      db.run("INSERT INTO devices VALUES (NULL, ?, ?, ?, ?)",devices[i][0],devices[i][1],devices[i][2],devices[i][3]);  
    }
    
    db.run("COMMIT");


    // test to read JSON from database
    db.each("SELECT properties_json FROM switches WHERE id=1", function(err,row) {
      var props = JSON.parse(row.properties_json);
      console.log(props);
    })


    db.close();
  })

}

// export the class
// module.exports = DbTool;

var dbtool = new DbTool();

dbtool.init(db);

// module.exports = DbInit;