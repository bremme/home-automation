
/**
 * Module dependencies
 */


var routes  = require('./server/routes.js');
// var api = require('./routes/api')
var path    = require('path');

var express = require('express');
var app = express();
var server    = require('http').createServer(app);
var io      = require('socket.io').listen(server);




 
/**
* Configuration
*/

// all environments
app.set('port', process.env.PORT || 3003);
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


/**
* Start Server
*/

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});


io.on('connection', function(socket){
  console.log('a client connected');
});