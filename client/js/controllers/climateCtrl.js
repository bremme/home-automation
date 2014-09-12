'use strict'

angular.module('app.controllers')
// Climate controller //////////////////////////////////////////////////////////
.controller('climateCtrl',
[ '$scope', '$timeout', 'socket', function ( $scope, $timeout, socket ) {

  $scope.isCollapsed = false;

  // temperature setpoint increament/decreament
  $scope.INCTEMP = 0.5;

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
  
  
  // initialise timeout
  var mytimeout = null;

  var COUNTDOWNSECONDS = 1;

  $scope.addTemp = function(add) {
  
    $scope.climate.setTemp += add;
    // reset time out counter (wait another second for user input )
    // $scope.timeOutCounter = 1;
    // console.log( 'change:climate: reset timeout counter (user clicked within timeout)')
    // 
    if ( ! mytimeout ) { 
      console.log('change:climate: waiting ' + COUNTDOWNSECONDS + ' sec for more user input...');
      // set initial timeout counter
      $scope.timeOutCounter = COUNTDOWNSECONDS;
      startTimeOut( function() {
        // do stuff //
        var data = {};
        data.setTemp = $scope.climate.setTemp;
        socket.emit('change:climate', data, function(err) {
          if (err) {
            console.log('change:climate: ERROR ' + JSON.stringify(err));

          // TODO handle error (revert) / ask for server update


          } else {
            console.log('change:climate: new setpoint is ' + $scope.climate.setTemp + ' by this client');  
          }
        });
        // end do stuff //
      })    
    } else {
      // reset timeout counter
      $scope.timeOutCounter = COUNTDOWNSECONDS;
      console.log('change:climate: resetting user timeout to ' + COUNTDOWNSECONDS + ' sec');  
    }   
  }

  // Private helper functions 

  var startTimeOut = function(fn) {

    if ( $scope.timeOutCounter === 0 ) {
      console.log('change:climate: timeout finished!');
      $timeout.cancel(mytimeout);
      mytimeout = null;
      fn();
      return;
    }
     
    // coundown
    $scope.timeOutCounter -= 1  
           
    mytimeout = $timeout(function () {
      startTimeOut(fn) }, 1000);
  }




}])