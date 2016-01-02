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
        skip: ctrl.activitiesPerPage * (pageNumber - 1),  // TODO This is not performant.
        sort: ['name']
      }).then(function(result) {
        ctrl.shownActivities = lodash.map(result.docs, function(doc) {
          return new Activity(doc);
        });
        return Activity.count();
      }).then(function(count) {
        ctrl.numActivities = count;
        return Entry.findMostRecent();
      }).then(function(entry) {
        return entry.findActivity();
      }).then(function(activity) {
        ctrl.activeActivity = activity;
        $scope.$apply();
      });
    };

    var reset = function() {
      ctrl.activity = new Activity();
      loadPaginatedActivities(ctrl.currentPage);
    };

    ctrl.isActive = function(activity) {
      return (
        typeof ctrl.activeActivity !== 'undefined' &&
        activity._id === ctrl.activeActivity._id
      );
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
    
    ctrl.stopActivity = function() {
      var entry = new Entry({ startedAt: moment().toJSON() }); 
      entry.save().then(reset);
    };

    ctrl.switchTo = function(activity) {
      var entry = new Entry({ activityId: activity._id, startedAt: moment().toJSON() });
      entry.save().then(reset);
    };

    reset();
  });
