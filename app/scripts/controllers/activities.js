'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:ActivitiesCtrl
 * @description
 * # ActivitiesCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('ActivitiesCtrl', function($window, lodash, Activity) {
    var ctrl = this;

    // TODO Tidy this.... especially the pagination stuff.

    var initializeNewActivity = function() {
      ctrl.newActivity = new Activity();
    };

    var resetForm = function() {
      initializeNewActivity();
      ctrl.form.$setPristine();
      ctrl.form.$setUntouched();
    };

    ctrl.shownActivities = [];
    ctrl.activitiesPerPage = 5;

    var getResultsPage = function(pageNumber) {
      Activity.find({
        selector: { name: { $gt: '' } },  // TODO I just want to say "all"...
        limit: ctrl.activitiesPerPage,
        skip: ctrl.activitiesPerPage * (pageNumber - 1),
        sort: ['name']
      }).then(function(result) {
        ctrl.shownActivities = lodash.map(result.docs, function(doc) {
          updateNumActivities();
          return new Activity(doc);
        });
      });
    };
    var repaginate = function() {
      getResultsPage(ctrl.pagination.current);
    };
    ctrl.pagination = { current: 1 };
    ctrl.pageChanged = function(newPage) {
      getResultsPage(newPage);
    };
    ctrl.numActivities = 0;
    var updateNumActivities = function() {
      Activity.info().then(function(result) {
        ctrl.numActivities = result.doc_count;
      });
    };

    var reset = function() {
      resetForm();
      repaginate();
    };

    repaginate();

    ctrl.addActivity = function() {
      if (ctrl.form.$valid) {
        ctrl.newActivity.save().then(function() {
          reset();
        });
      }
    };

    ctrl.removeActivity = function(activity) {
      if ($window.confirm('Are you sure you want to delete the activity "' + activity.name + '"?')) {
        activity.remove().then(function() {
          reset();
        });
      }
    };

    ctrl.showError = function(fieldName) {
      var field = ctrl.form[fieldName];
      return field.$invalid && (field.$touched || ctrl.form.$submitted);
    };

    initializeNewActivity();
  });
