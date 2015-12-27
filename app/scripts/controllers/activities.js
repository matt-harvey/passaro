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

    var resetForm = function() {
      initializeNewActivity();
      that.form.$setPristine();
      that.form.$setUntouched();
    };

    that.activities = function() {
      return TimeLog.activities();
    };

    that.addActivity = function() {
      if (that.form.$valid) {
        TimeLog.addActivity(that.newActivity);
        resetForm();
      }
    };

    that.removeActivity = function(activity) {
      TimeLog.removeActivity(activity);
    };

    initializeNewActivity();
  });
