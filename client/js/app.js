'use strict';

angular.module( 'homeAutomationApp', [ 'ui.router' ] )

  .config(['$stateProvider', '$urlRouterProvider', function ( $stateProvider, $urlRouterProvider ) {

    $urlRouterProvider.otherwise( '/' );

    $stateProvider
      .state('home' , {
        url: '/',
        templateUrl: 'partials/home',
        controller: 'mainCtrl'
      });

  }]);