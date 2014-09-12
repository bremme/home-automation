
var sqlite3 = require('sqlite3').verbose();
var db      = new sqlite3.Database('db/home.db');


var curTemp = 20;
var setTemp = 23;
var heaterOn = 1;
var climateProgramId = 1;

var climateProgramName = 'Manual';


db.serialize( function() {

  db.run('BEGIN TRANSACTION', function(err) {
    if (err) {
      console.log(err)
    }
  });

  db.run("DROP TABLE IF EXISTS ClimatePrograms", function(err) {
    if (err) {
      console.log(err)
    }
  });
  db.run("CREATE TABLE IF NOT EXISTS ClimatePrograms (\
    id INTEGER PRIMARY KEY,\
    name TEXT)\
    ", function(err) {
    if (err) {
      console.log(err)
    }
  });

  db.run("DROP TABLE IF EXISTS ClimateState", function(err) {
    if (err) {
      console.log(err)
    }
  });
  db.run("CREATE TABLE ClimateState (\
    id INTEGER PRIMARY KEY,\
    currentTemp DECIMAL(5,2),\
    setTemp DECIMAL(5,2),\
    heaterOn INTEGER,\
    climateProgramId INTEGER,\
    FOREIGN KEY(climateProgramId) REFERENCES ClimatePrograms(id))\
    ", function(err) {
    if (err) {
      console.log(err)
    }
  });

  
  db.run("INSERT INTO ClimateState VALUES(NULL,?,?,?,?)",[curTemp,setTemp,heaterOn,climateProgramId], function(err) {
    if (err) {
      console.log(error);
    }
  });
  db.run("INSERT INTO ClimatePrograms VALUES(NULL,?)",[climateProgramName], function(err) {
    if (err) {
      console.log(error);
    }
  });

  db.run("DROP VIEW IF EXISTS v_Climate_State");
  db.run("CREATE VIEW IF NOT EXISTS v_ClimateState\
   AS SELECT ClimateState.currentTemp, ClimateState.setTemp, \
   ClimateState.heaterOn, ClimatePrograms.name AS climateProgram \
   FROM ClimateState, ClimatePrograms \
   WHERE ClimateState.climateProgramId=climatePrograms.id");


  db.run('COMMIT')

});
db.close();