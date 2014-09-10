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
.controller('switchesCtrl',
[ '$scope', 'socket', function ( $scope, socket ) {

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

  $scope.lightHallway = 'off';

  $scope.$watchCollection('lights', function(newValue, oldValue) { 

    var changedSwitch = {};

    // loop over items in object
    for (var key in newValue ) {

      if (newValue[key] != oldValue[key]) {
        changedSwitch[key] = newValue[key];
        
        console.log(key + ' ' + newValue[key])
        break;
      }
    } 
  });

}])
.controller('weatherCtrl',
[ '$scope', function ( $scope ) {

}]);