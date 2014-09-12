
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

  db.run("DROP TABLE IF EXISTS climate_programs", function(err) {
    if (err) {
      console.log(err)
    }
  });
  db.run("CREATE TABLE IF NOT EXISTS climate_programs (\
    id INTEGER PRIMARY KEY,\
    name TEXT)\
    ", function(err) {
    if (err) {
      console.log(err)
    }
  });

  db.run("DROP TABLE IF EXISTS climate_state", function(err) {
    if (err) {
      console.log(err)
    }
  });
  db.run("CREATE TABLE climate_state (\
    id INTEGER PRIMARY KEY,\
    current_temp DECIMAL(5,2),\
    set_temp DECIMAL(5,2),\
    heater_on INTEGER,\
    climate_program_id INTEGER,\
    FOREIGN KEY(climate_program_id) REFERENCES climate_programs(id))\
    ", function(err) {
    if (err) {
      console.log(err)
    }
  });

  
  db.run("INSERT INTO climate_state VALUES(NULL,?,?,?,?)",[curTemp,setTemp,heaterOn,climateProgramId], function(err) {
    if (err) {
      console.log(error);
    }
  });
  db.run("INSERT INTO climate_programs VALUES(NULL,?)",[climateProgramName], function(err) {
    if (err) {
      console.log(error);
    }
  });

  db.run("DROP VIEW IF EXISTS v_climate_state");
  db.run("CREATE VIEW IF NOT EXISTS v_climate_state AS SELECT climate_state.current_temp as curTemp, climate_state.set_temp as setTemp, climate_state.heater_on as heaterOn, climate_programs.name as climateProgram FROM climate_state, climate_programs WHERE climate_state.climate_program_id=climate_programs.id");


  db.run('COMMIT')

});
db.close();