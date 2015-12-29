'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:ActivitiesCtrl
 * @description
 * # ActivitiesCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('ActivitiesCtrl', function($window, Activity) {
    var ctrl = this;

    var initializeNewActivity = function() {
      ctrl.newActivity = new Activity();
    };

    var resetForm = function() {
      initializeNewActivity();
      ctrl.form.$setPristine();
      ctrl.form.$setUntouched();
    };

    ctrl.activities = function() {
      return Activity.all();
    };

    ctrl.addActivity = function() {
      if (ctrl.form.$valid) {
        ctrl.newActivity.save();
        resetForm();
      }
    };

    ctrl.removeActivity = function(activity) {
      if ($window.confirm('Are you sure you want to delete the activity "' + activity.name + '"?')) {
        activity.remove();
      }
    };

    ctrl.showError = function(fieldName) {
      var field = ctrl.form[fieldName];
      return field.$invalid && (field.$touched || ctrl.form.$submitted);
    };

    initializeNewActivity();
  });
