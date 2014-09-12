'use strict'

angular.module('app.controllers')
// Alert controller //////////////////////////////////////////////////////////
.controller('alertsCtrl', [ '$scope' , function( $scope ) {

  $scope.alerts = [
    { type: 'info', msg: 'Yeah boy!'}
  ];



}]);