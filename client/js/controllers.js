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
[ '$scope', 'socket', function ( $scope, socket ) {

  $scope.isCollapsed = false;

  // Light switches

  // Initialization of switches
  socket.on('init:switch:lights',function(data) {

    $scope.lights = {};

    var location = '';
    var shortName = '';

    // attach to scope
    for (var i = 0; i < data.length; i++) {

      location = data[i].dev_loc;
      shortName =data[i].dev_name_short;

      // check if location (already) exists
      if ( !$scope.lights.hasOwnProperty(location) ) {
        $scope.lights[location] = {};
      }
      // check if shortName (already) exists
      if ( !$scope.lights[location].hasOwnProperty(shortName) ) {
        $scope.lights[location][shortName] ={};      }

      $scope.lights[location][shortName]['id'] = data[i].dev_id;
      $scope.lights[location][shortName]['state'] = data[i].dev_state;

    }       
  })


  socket.on('change:switch', function(sw) {
    console.log('change:switch');
    $scope.lights[sw.location][sw.nameShort]['state'] = sw.state;
    // find switch with id

    // set new state of switch

  })

  $scope.switchClicked = function(sw) {

    var data = {};
    data.id = sw.id;
    data.state = sw.state;
    socket.emit('change:switch',data);

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