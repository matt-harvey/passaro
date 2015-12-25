'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:ActivitiesCtrl
 * @description
 * # ActivitiesCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('ActivitiesCtrl', function(TimeLog) {
    var that = this;

    var initializeNewActivity = function() {
      that.newActivity = { name: '' }; 
    };

    that.activities = function() {
      return TimeLog.activities();
    };

    that.addActivity = function() {
      TimeLog.addActivity(that.newActivity);
      initializeNewActivity();
    };

    that.removeActivity = function(activityId) {
      TimeLog.removeActivity(activityId);
    };

    initializeNewActivity();
  });
