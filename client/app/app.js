'use strict';

angular.module('twitterSearchApp', [
  'ngResource',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'landing.controller',
  'twitter.services',
  'localData.services'
])

  .config(['$urlRouterProvider','$stateProvider','$locationProvider',function($urlRouterProvider, $stateProvider,$locationProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        views:{
          "" : {
            templateUrl: 'app/components/index/landing.html',
            controller: 'LandingCtrl',
            controllerAs: 'lc'
          },
          "searchBar@index" : {
            templateUrl  : 'app/components/index/searchBox.html'
          },
          "searchHistory@index" : {
            templateUrl  : 'app/components/index/historySearch.html'
          },
          "tweets@index" : {
            templateUrl  : 'app/components/index/tweets.html'
          }
        }
      });

    $locationProvider.html5Mode(true);
  }]);
