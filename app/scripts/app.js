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
    'angularUtils.directives.dirPagination',
    'angularMoment',
    'ngAria',
    'ngMessages',
    'ngRoute',
    'ngSanitize',
    'ngLodash',
    'pouchdb',
    'ui.bootstrap'
  ]).config(function($routeProvider) {
    $routeProvider
      .when('/entries', {
        templateUrl: '/views/entries.html',
        controller: 'EntriesCtrl',
        controllerAs: 'ctrl'
      })
      .when('/activities', {
        templateUrl: 'views/activities.html',
        controller: 'ActivitiesCtrl',
        controllerAs: 'ctrl'
      })
      .when('/reports', {
        templateUrl: 'views/reports.html',
        controller: 'ReportsCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/entries'
      });
  });
