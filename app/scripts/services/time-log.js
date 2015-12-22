'use strict';

/**
 * @ngdoc service
 * @name passaroApp.TimeLog
 * @description
 * # TimeLog
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  .service('TimeLog', function() {
    var that = this;

    var activities = [];

    that.activities = function() {
      return activities;
    };

    that.addActivity = function(activity) {
      activities.push(activity);
    };
  });
