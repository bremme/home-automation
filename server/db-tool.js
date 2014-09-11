

var fs      = require('fs');
// fs.unlinkSync('db/home.db');
var sqlite3 = require('sqlite3').verbose();
var db      = new sqlite3.Database('db/home.db');

console.log('open db: ' + JSON.stringify(db));


// local variables

// name, floor
var locations = [
  ['hallway','first'],
  ['kitchen','first'],
  ['livingroom','first'],
  ['studyroom','first'],
  ['loft','loft']];
var systemCodes = [];
var receiverCodes = [];
for (var i=0 ; i <  32 ; i++) { systemCodes[i] = i }
for (var i=0 ; i <   5 ; i++) { receiverCodes[i] = String.fromCharCode(65 + i)}

var deviceTypes =[
  'light',
  'appliance'
  ];



// id, name, name_short, device_type_id, location_id, state, switch_id
devices = [['Hallway','halllight', 1, 1, 0 ,156],['Kitchen','kitchenlight', 1, 2,0,157],['Livingroom','livinglight', 1, 3,0,158],['Studyroom','studylight', 1, 4,0,159],
  ['Livingroom moodlight','moodlight', 1, 3, 0, 160],['H&K amplifier','hkamp', 2, 3,0,151],['Onkyo amplifier', 'onkamp', 2, 3,0,152],
  ['Loft','loftlight', 1, 5,0,153],['Loft lightstrip','lightstrip',1, 5,0,154],['Monitor','monitor', 2, 3,0,155]];

console.log('systemCodes: ' + systemCodes);


// object

function DbTool(db) {

};

// intialize the database
DbTool.prototype.init = function(db) {

  db.serialize(function() {

    // CREATE TABLES
    // Create Locations table
    db.run("CREATE TABLE locations (id INTEGER PRIMARY KEY, name TEXT, floor TEXT)",[],function(err){
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

    db.run("CREATE TABLE device_types (id INTEGER PRIMARY KEY, type TEXT)");

    // Create Switches table
    db.run("CREATE TABLE switches (id INTEGER PRIMARY KEY, switch_brand_id INTEGER, properties_json TEXT, FOREIGN KEY(switch_brand_id) REFERENCES switch_brands(id) )",[],function(err){
      if (err) {
        console.log(err);
      }
    });
    console.log('Created table: Switches');
    // Create Devices table
    // id, name, name_short, device_type_id, location_id, state, switch_id
    db.run("CREATE TABLE devices (\
      id INTEGER PRIMARY KEY,\
      name TEXT,\
      name_short TEXT,\
      device_type_id INTEGER,\
      location_id INTEGER,\
      state INTEGER, \
      switch_id INTEGER,\
      FOREIGN KEY(device_type_id) REFERENCES device_types(id),\
      FOREIGN KEY(location_id) REFERENCES locations(id),\
      FOREIGN KEY(switch_id) REFERENCES switches(id) \
      )",[],function(err){
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
      db.run("INSERT INTO locations VALUES (NULL,?,?)",[ locations[i][0], locations[i][1]],function(err){
        if (err) {
          console.log(err)
        }
      })
    }

    db.run("INSERT INTO switch_brands VALUES (NULL,?)", "Impulse");
    db.run("INSERT INTO device_types VALUES (NULL, ?)", deviceTypes[0]);
    db.run("INSERT INTO device_types VALUES (NULL, ?)", deviceTypes[1]);

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
      // id, name, name_short, device_type_id, location_id, state, switch_id
      db.run("INSERT INTO devices VALUES (NULL, ?, ?, ?, ?, ?, ?)",devices[i][0],devices[i][1],devices[i][2],devices[i][3], devices[i][4], devices[i][5]);  
    }
    
    db.run("COMMIT");


    // // test to read JSON from database
    // db.each("SELECT properties_json FROM switches WHERE id=1", function(err,row) {
    //   var props = JSON.parse(row.properties_json);
    //   console.log(props);
    // })


    // // Create views
    // db.run("CREATE VIEW IF NOT EXISTS v_devices AS SELECT devices.id as dev_id, devices.name as dev_name, locations.name as loc_name,switches.properties_json FROM devices,locations,switches WHERE devices.location_id=locations.id AND devices.switch_id=switches.id")

    db.run("CREATE VIEW IF NOT EXISTS v_devices \
      AS SELECT devices.id as devId, \
      device_types.type as devType, \
      locations.name as devLoc, \
      devices.name_short as devNameShort, \
      devices.name as devName, \
      devices.state as devState, \
      locations.floor as devFloor \
      FROM devices,locations,switches,device_types \
      WHERE devices.location_id=locations.id AND devices.switch_id=switches.id \
      AND devices.device_type_id=device_types.id \
      ORDER BY devType DESC, devFloor, devLoc\
      ");

    db.close();
  })

}

// export the class
// module.exports = DbTool;

var dbtool = new DbTool();

dbtool.init(db);

// module.exports = DbInit;