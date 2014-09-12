'use strict'

angular.module('app.controllers')
// Switches controller /////////////////////////////////////////////////////////
.controller('switchesCtrl',
[ '$scope', '$filter', 'socket', function ( $scope, $filter, socket ) {

  $scope.isCollapsed = false;

  // Light switches

  // Initialization of switches
  socket.on('init:switch',function(rows) {

    if (! $scope.switched ) {
      $scope.switches = [];  
    }
        
    for (var key in rows) {
      $scope.switches.push(rows[key]);
    }

    console.log('init:switch');

  });


  socket.on('change:switch', function(aSwitch) {
    // get the index of the switch that changed
    for (var i=0 ; i < $scope.switches.length ; i++) {
      if (aSwitch.devId === $scope.switches[i].devId ) {        
        break;
      }
    }
    // set the new state on the switch on the scope
    $scope.switches[i].devState = aSwitch.devState;
    // log message to console
    console.log('change:switch : ' + $scope.switches[i].devNameShort + ' ' + $scope.switches[i].devLoc + ' (id:' + aSwitch.devId + ') to "' + ((aSwitch.devState === 1) ? 'on ':'off') + '" by other client');
  })

  // handle switch clicked events
  $scope.switchClicked = function(aSwitch) {
    var data = {};
    data.devId = aSwitch.devId;
    data.devState = aSwitch.devState;
    socket.emit('change:switch',data);
    console.log('change:switch : ' + aSwitch.devNameShort + ' ' + aSwitch.devLoc + ' (id:' + aSwitch.devId + ') to "' + ((aSwitch.devState === 1) ? 'on ':'off') + '" by this client');
  }
}])