'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:ActivitiesCtrl
 * @description
 * # ActivitiesCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('ActivitiesCtrl', function($log, $scope, $window, lodash, moment, Activity, Entry) {
    var ctrl = this;

    // pagination state
    ctrl.shownActivities = [];
    ctrl.activitiesPerPage = 5;
    ctrl.currentPage = 1;
    ctrl.numActivities = 0;

    var loadPaginatedActivities = function(pageNumber) {
      Activity.find({
        selector: { name: { $gte: '' } },  // Get all activities. (Can this be done less hackily?)
        limit: ctrl.activitiesPerPage,
        skip: ctrl.activitiesPerPage * (pageNumber - 1),
        sort: ['name']
      }).then(function(result) {
        ctrl.shownActivities = lodash.map(result.docs, function(doc) {
          return new Activity(doc);
        });
        return Activity.info();
      }).then(function(result) {
        ctrl.numActivities = result.doc_count;
        $scope.$apply();
      });
    };

    var reset = function() {
      ctrl.activity = new Activity();
      loadPaginatedActivities(ctrl.currentPage);
    };

    ctrl.pageChanged = loadPaginatedActivities;

    ctrl.addActivity = function() {
      ctrl.activity.save().then(reset).catch(lodash.noop);
    };

    ctrl.removeActivity = function(activity) {
      if ($window.confirm('Are you sure you want to delete the activity "' + activity.name + '"?')) {
        activity.remove().then(reset);
      }
    };

    ctrl.switchTo = function(activity) {
      var entry = new Entry({ activityId: activity._id, startedAt: moment().toJSON() });
      entry.save();
    };

    reset();
  });
