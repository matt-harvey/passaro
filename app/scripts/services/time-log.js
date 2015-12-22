'use strict';

/**
 * @ngdoc service
 * @name passaroApp.TimeLog
 * @description
 * # TimeLog
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  .service('TimeLog', function($indexedDB) {
    var that = this;
    var activities;

    var initialize = function() {
      loadActivities();
    };

    var loadActivities = function() {
      $indexedDB.openStore('activities', function(store) {
        store.getAll().then(function(results) {
          activities = results;
        });
      });
    };

    that.activities = function() {
      return activities;
    };

    that.addActivity = function(activity) {
      $indexedDB.openStore('activities', function(store) {
        store.insert(activity);
      }).then(function() {
        activities.push(activity);
      });
    };

    initialize();
  });
