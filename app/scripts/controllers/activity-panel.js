'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:ActivityPanelCtrl
 * @description
 * # ActivityPanelCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('ActivityPanelCtrl', function(TimeLog) {
    var that = this;

    var initializeNewActivity = function() {
      that.newActivity = { name: '' }; 
    };

    that.activities = TimeLog.activities;

    that.addActivity = function() {
      TimeLog.addActivity(that.newActivity);
      initializeNewActivity();
    };

    initializeNewActivity();
  });
