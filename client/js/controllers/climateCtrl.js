'use strict'

angular.module('app.controllers')
// Climate controller //////////////////////////////////////////////////////////
.controller('climateCtrl',
[ '$scope', '$timeout', 'socket', function ( $scope, $timeout, socket ) {

  $scope.isCollapsed = false;

  // temperature setpoint increament/decreament
  $scope.incTemp = 0.5;

  // SOCKET ON (UPDATES) ///////////////////////////////////////////////////////

  socket.on('init:climate', function(rows) {

    $scope.climate = rows[0];
    console.log('init:climate');

  })

  socket.on('change:climate', function(data) {
    

    for (var key in data) {
      $scope.climate[key] = data[key];
    }

  });

// SOCKET EMIT (UPDATE) //////////////////////////////////////////////////////
  
  $scope.timeOutStarted = false;

  $scope.addTemp = function(add) {

    
    $scope.climate.setTemp += add;

    if (! $scope.timeOutStarted) {

      $scope.timeOutStarted = true;
      console.log('change:climate: waiting for more user input...')
      // 
      $timeout( function() {
        var data = {};
        data.setTemp = $scope.climate.setTemp;
        // TODO it would be better to wait one second
        socket.emit('change:climate', data );
        console.log('change:climate: new setpoint is ' + $scope.climate.setTemp + ' by this client');
        $scope.timeOutStarted = false;
      }, 2000);

    }



  }

}])