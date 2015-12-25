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
    'ngSanitize',
    'indexedDB',
    'ngLodash'
  ])
  .config(function($routeProvider, $indexedDBProvider) {
    $routeProvider
      .when('/activities', {
        templateUrl: 'views/activities.html',
        controller: 'ActivitiesCtrl',
        controllerAs: 'activitiesCtrl'
      });
    $indexedDBProvider
      .connection('passaro')
      .upgradeDatabase(1, function(event, db /*, transaction */) {
        var activitiesStore = db.createObjectStore('activities', {
          autoIncrement: true,
          keyPath: 'id'
        });
        // FIXME Names should be unique; but need to handle with user-friendly
        // validation.
        activitiesStore.createIndex('nameIndex', 'name', { unique: false });
      });
  });
