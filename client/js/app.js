'use strict';



angular.module( 'app', [
  'app.controllers',
  'app.services',
  'ui.router', 
  'ui.bootstrap', 
  'btford.socket-io' 
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ( $stateProvider, $urlRouterProvider ) {

    $urlRouterProvider.otherwise( '/' );

    $stateProvider
      .state( 'home', {
        url: '/',
        views: {
          '': {
            templateUrl: 'partials/widgets'
          },
          'switches-widget@home': {
            templateUrl: 'partials/switches-widget',
            controller: 'switchesCtrl'
          },
          'climate-widget@home': {
            templateUrl: 'partials/climate-widget',
            controller: 'climateCtrl'
          }
        }
      });
  }]);


angular.module('app.controllers',[]); 
