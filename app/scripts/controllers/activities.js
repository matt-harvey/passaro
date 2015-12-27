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
    // TODO Form validation / resetting code both here and in the HTML could use
    // some DRYing up.
    var that = this;
    var formSubmitted = false;

    var initializeNewActivity = function() {
      that.newActivity = { name: '' }; 
    };

    var resetForm = function() {
      initializeNewActivity();
      that.form.name.$touched = false;
      formSubmitted = false;
    };

    that.activities = function() {
      return TimeLog.activities();
    };

    that.addActivity = function() {
      formSubmitted = true;
      if (that.form.$valid) {
        TimeLog.addActivity(that.newActivity);
        resetForm();
      }
    };

    that.showErrors = function(fieldName) {
      var field = that.form[fieldName];
      return (formSubmitted || field.$touched) && field.$invalid;
    };

    that.removeActivity = function(activity) {
      TimeLog.removeActivity(activity);
    };

    initializeNewActivity();
  });
