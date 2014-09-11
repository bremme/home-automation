'use strict';

/* Controllers */

angular.module('app.controllers',[])
.controller('mainCtrl',
['$scope', function ( $scope ) {

  $scope.title = "Hello world!"  
  $scope.sitename = "Example.com"

}])
.controller('climateCtrl',
[ '$scope', function ( $scope ) {

  $scope.items = ["A", "List", "Of", "Items"];

}])

// Switches controller
.controller('switchesCtrl',
[ '$scope', '$filter', 'socket', function ( $scope, $filter, socket ) {

  $scope.isCollapsed = false;

  // Light switches

  // Initialization of switches
  socket.on('init:switch:lights',function(rows) {

    if (! $scope.switched ) {
      $scope.switches = [];  
    }
        
    for (var key in rows) {
      $scope.switches.push(rows[key]);
    }     
  })


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

  // // Watch for light switch changes
  // $scope.$watch('lights', function(newValue, oldValue) {     

  //   console.log(newValue);

  //   var id = 0;
  //   var state = 0;

  //   var newStates = [];
  //   var oldStates = [];

  //   // get newStates and oldStates
  //   for ( var loc in newValue ) {


  //   }


  //   // // loop over items in object
  //   // for (var key in newValue ) {

  //   //   if (newValue[key] != oldValue[key]) {
  //   //     console.log(key + ' ' + newValue[key])
  //   //     socket.emit('change:switch', {somedata: 'somedata'}, function(err) {
          
  //   //     })
  //   //     break;
  //   //   }
  //   // } 
  // }, true);

  // Appliance switches


}])
.controller('weatherCtrl',
[ '$scope', function ( $scope ) {

}]);