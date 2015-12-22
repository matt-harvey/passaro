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
    'indexedDB'
  ])
  .config(function($routeProvider, $indexedDBProvider) {
    $routeProvider
      .when('/', {
        // FIXME This doesn't even exist
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
    $indexedDBProvider
      .connection('passaro')
      .upgradeDatabase(1, function(event, db /*, transaction */) {
        var activitiesStore = db.createObjectStore('activities', { autoIncrement: true });
        // FIXME Names should be unique; but need to handle with user-friendly
        // validation.
        activitiesStore.createIndex('nameIndex', 'name', { unique: false });
      });
  });
