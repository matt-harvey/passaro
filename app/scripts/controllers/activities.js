'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:ActivitiesCtrl
 * @description
 * # ActivitiesCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('ActivitiesCtrl', function($log, $scope, $window, lodash, moment, Activity,
    Entry, MultiSync) {
    var ctrl = this;

    ctrl.rows = [];
    ctrl.rowsPerPage = 10;

    // pagination state - use MultiSync to remember between page visits.
    MultiSync.connect($scope, 'ActivitiesCtrl', ctrl, {
      currentPage: 1,
      totalRows: 0
    });

    var loadPaginatedActivities = function(pageNumber) {
      Activity.find({
        selector: { name: { $gte: '' } },  // Get all activities. (Can this be done less hackily?)
        limit: ctrl.rowsPerPage,
        skip: ctrl.rowsPerPage * (pageNumber - 1),  // TODO This is not performant.
        sort: ['name']
      }).then(function(result) {
        ctrl.rows = lodash.map(result.docs, function(doc) {
          return { activity: new Activity(doc), removable: false };
        });
        return Activity.count();
      }).then(function(count) {
        ctrl.totalRows = count;
        return Entry.findMostRecent();
      }).then(function(entry) {
        return entry.findActivity();
      }).then(function(activity) {
        ctrl.activeActivity = activity;
        $scope.$apply();

        lodash.each(ctrl.rows, function(row) {
          Entry.find({
            selector: { activityId: row.activity._id },
            limit: 1,
            fields: []
          }).then(function(result) {
            if (result.docs.length === 0) {
              row.removable = true;
              $scope.$apply();
            }
          });
        });
      });
    };

    var reset = function() {
      ctrl.activity = new Activity();
      loadPaginatedActivities(ctrl.currentPage);
    };
    
    var stopActivity = function() {
      var entry = new Entry({ activityName: '', startedAt: moment().valueOf() }); 
      entry.save().then(function() {
        ctrl.activeActivity = undefined;
      });
    };

    var switchTo = function(row) {
      var entry = new Entry({
        activityId: row.activity._id,
        activityName: row.activity.name,
        startedAt: moment().valueOf()
      });
      entry.save().then(function() {
        ctrl.activeActivity = row.activity;
        row.removable = false;
      });
    };

    ctrl.isActive = function(row) {
      return (
        typeof ctrl.activeActivity !== 'undefined' &&
        row.activity._id === ctrl.activeActivity._id
      );
    };

    ctrl.toggleActivity = function(row) {
      if (ctrl.isActive(row)) {
        stopActivity();
      } else {
        switchTo(row);
      }
    };

    ctrl.pageChanged = loadPaginatedActivities;

    ctrl.addActivity = function() {
      ctrl.activity.save().then(reset).catch(lodash.noop);
    };

    ctrl.removeActivity = function(row) {
      if ($window.confirm('Are you sure you want to delete the activity "' +
        row.activity.name + '"?')) {
        row.activity.remove().then(reset);
      }
    };

    reset();
  });
