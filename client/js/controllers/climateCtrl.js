'use strict'

angular.module('app.controllers')
// Climate controller //////////////////////////////////////////////////////////
.controller('climateCtrl',
[ '$scope','socket', function ( $scope, socket ) {

  $scope.isCollapsed = false;

  // temperature setpoint increament/decreament
  $scope.incTemp = 0.5;

  socket.on('init:climate', function(rows) {

    $scope.climate = rows[0];
    console.log('init:climate');

  })

  $scope.addTemp = function(add) {

    $scope.climate.setTemp += add;
    console.log('change:climate: new setpoint is ' + $scope.climate.setTemp + ' by this client');

  }

}])