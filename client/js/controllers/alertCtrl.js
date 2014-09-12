'use strict'

angular.module('app.controllers')
// Alert controller //////////////////////////////////////////////////////////
.controller('alertCtrl', [ '$scope'], function( $scope ) {

  $scope.alerts = [
    { type: 'info', msd: 'Yeah boy!'}
  ];

});