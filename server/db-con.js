
var sqlite3 = require('sqlite3').verbose();
var nconf   = require('nconf').argv().env().file({ file: 'config.json'});

var db = new sqlite3.Database(nconf.get('dbFile'));

module.exports = db;

// var connectionInstance;

// module.exports = function(callback) {
//   // check if there is already a databaser connection
//   if (connectionInstance) {
//     console.log('reusing database connection')
//     callback(connectionInstance);
//     return
//   }
//   console.log( 'creating initial database connection')
//   var db = new sqlite3.Database(nconf.get('dbFile'));

//   connectionInstance = db;
//   callback(db);

// }