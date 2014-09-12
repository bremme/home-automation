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


    $stateProvider.state('root', {
      url: '',
      abstract: true,
      views: {
        'navbar@' : { templateUrl: 'partials/navbar'},
        'alerts@' : { 
          templateUrl: 'partials/alerts',
          controller : 'alertsCtrl'
        },
        'footer@'  : { templateUrl: 'partials/footer'}
      }
    })
    .state('root.home', {
      url: '/',
      views: {
        'switches-widget@': {
          templateUrl: 'partials/home-switches-widget',
          controller: 'switchesCtrl'
        },
        'climate-widget@': {
          templateUrl: 'partials/home-climate-widget',
          controller: 'climateCtrl'
        }
      }
    })    


    // $stateProvider
    //   .state( 'home', {
    //     url: '/',
    //     views: {
    //       '': {
    //         templateUrl: 'partials/widgets'
    //       },
    //       'switches-widget@home': {
    //         templateUrl: 'partials/switches-widget',
    //         controller: 'switchesCtrl'
    //       },
    //       'climate-widget@home': {
    //         templateUrl: 'partials/climate-widget',
    //         controller: 'climateCtrl'
    //       },
    //       'alerts@home': {
    //         templateUrl
    //       }
    //     }
    //   })
    // .state( 'test', {
    //   url: '/test',
    //   templateUrl: 'test',
    //   controller: 'testCtrl'
    // })
  }]);


angular.module('app.controllers',[]); 
