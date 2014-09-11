
/**
 * Module dependencies
 */


var routes  = require('./server/routes/routes.js');
// var api = require('./routes/api')
var path    = require('path');
var fs      = require('fs');
var nconf   = require('nconf').argv().env().file({ file: 'config.json'});
// var sqlite3 = require('sqlite3').verbose();
// var db      =  new sqlite3.Database(nconf.get('dbFile'));
// var setupDb = require('./server/db-first-run');

var express = require('express');
var app = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);

// own modules
var socketHandler  = require('./server/routes/sockets.js');
var socketHandler = new socketHandler();
var db   = require('./server/db-con.js');

/**
* Configuration
*/

// all environments
app.set('port', process.env.PORT || nconf.get('port'));
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'client')));

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
  app.locals.pretty = true;
};

// production only
if (app.get('env') === 'production') {
  // TODO
}; 


// ROUTES

// index route
app.get('/', routes.index);
// partials route
app.get('/partials/:name', routes.partials);

// JSON API

// SOCKETS
io.on('connection', socketHandler.listen );


// Database 


/**
* Start Server
*/

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});


