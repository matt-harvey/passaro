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
    'ngMessages',
    'ngRoute',
    'ngSanitize',
    'ngLodash',
    'pouchdb'
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when('/stints', {
        templateUrl: '/views/stints.html'  // TODO Add controller
      })
      .when('/activities', {
        templateUrl: 'views/activities.html',
        controller: 'ActivitiesCtrl',
        controllerAs: 'ctrl'
      })
      .when('/reports', {
        templateUrl: 'views/reports.html'  // TODO Add controller
      })
      .otherwise({
        redirectTo: '/stints'
      });
  });
