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

  // Light switches



  $scope.isCollapsed = false;

  $scope.lights = { 
    hallway:'off',
    kitchen:'off',
    livingRoom:'off',
    moodLight:'off',
    studyRoom:'off',
    upstairs:'off',
    upstairsMood:'off'
  }

  // Watch for light switch changes
  $scope.$watchCollection('lights', function(newValue, oldValue) {     

    // loop over items in object
    for (var key in newValue ) {

      if (newValue[key] != oldValue[key]) {
        console.log(key + ' ' + newValue[key])
        socket.emit('change:switch', {somedata: 'somedata'}, function(err) {
          
        })
        break;
      }
    } 
  });
  // Appliance switches


}])
.controller('weatherCtrl',
[ '$scope', function ( $scope ) {

}]);