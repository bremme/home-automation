'use strict';

/* Controllers */

angular.module('homeAutomationApp')
.controller('mainCtrl',
['$scope', function ( $scope ) {

      $scope.title = "Hello world!"  
      $scope.sitename = "Example.com"

}]);