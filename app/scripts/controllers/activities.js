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

    // pagination state
    ctrl.shownActivities = [];
    ctrl.activitiesPerPage = 5;
    ctrl.pagination = { current: 1 };
    ctrl.numActivities = 0;

    var loadPaginatedActivities = function(pageNumber) {
      Activity.find({
        selector: { name: { $gt: '' } },  // TODO I just want to say "all"...
        limit: ctrl.activitiesPerPage,
        skip: ctrl.activitiesPerPage * (pageNumber - 1),
        sort: ['name']
      }).then(function(result) {
        ctrl.shownActivities = lodash.map(result.docs, function(doc) {
          return new Activity(doc);
        });
        // update the number of activities
        Activity.info().then(function(result) {
          ctrl.numActivities = result.doc_count;
        });
      });
    };

    var reset = function() {
      ctrl.newActivity = new Activity();
      if (typeof ctrl.form !== 'undefined') {
        ctrl.form.$setPristine();
        ctrl.form.$setUntouched();
      }
      loadPaginatedActivities(ctrl.pagination.current);
    };

    ctrl.pageChanged = function(newPage) {
      loadPaginatedActivities(newPage);
    };

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

    reset();
  });
