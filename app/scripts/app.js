'use strict';

/**
 * @ngdoc overview
 * @name passaroApp
 * @description
 * # passaroApp
 *
 * Main module of the application.
 */
angular
  .module('passaroApp', [
    'ngAria',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
