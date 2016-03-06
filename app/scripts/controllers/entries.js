'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:EntriesCtrl
 * @description
 * # EntriesCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('EntriesCtrl', function($log, $interval, $q, $scope, $window, lodash, moment,
    Activity, Entry, MultiSync) {
    // TODO A lot of code is similar to that in controllers/activities.js. Factor out the
    // shared stuff.

    var ctrl = this;
    ctrl.rows = [];
    ctrl.retrievedEntries = [];
    ctrl.rowsPerPage = 10;

    // pagination state - use MultiSync to remember between page visits.
    MultiSync.connect($scope, 'EntriesCtrl', ctrl, {
      currentPage: 1,
      totalRows: 0
    });

    var loadPaginatedEntries = function(pageNumber) {
      var onFirstPage = (ctrl.currentPage === 1);
      var numToSkip = (
        onFirstPage ?
        0 :
        // we need to see an additional entry to get end time of top row
        ctrl.rowsPerPage * (pageNumber - 1) - 1
      );
      var limit = (
        onFirstPage ?
        ctrl.rowsPerPage :
        // we need to see an additional entry to get end time of top row
        ctrl.rowsPerPage + 1  
      );
      // TODO Move logic for retrieving Entries into Service as we will want to reuse
      // much of this on reports page.
      Entry.find({
        selector: { startedAt: { $gte: 0 } },  // Get all. (Can this be done less hackily?)
        limit: limit,
        skip: numToSkip,  // TODO This is not performant.
        sort: [{ startedAt: 'desc' }]
      }).then(function(result) {
        ctrl.retrievedEntries = lodash.map(result.docs, function(doc) {
          return new Entry(doc);
        });
        var displayedEntries = ctrl.retrievedEntries.slice(onFirstPage ? 0 : 1);
        ctrl.rows = lodash.map(displayedEntries, function(entry) {
          return { entry: entry, isVeryEarliest: false };
        });
        var rows = ctrl.rows;
        lodash.each(rows, function(row, index) {
          var previousIndex = index - 1;
          row.started = row.entry.startedAt;
          if (previousIndex === -1) {
            row.isActive = onFirstPage;
            row.ended = (
              onFirstPage ?
              moment().valueOf() :
              ctrl.retrievedEntries[0].startedAt
            );
          } else {
            row.isActive = false;
            row.ended = rows[previousIndex].entry.startedAt;
          }
        });
        return Entry.count();
      }).then(function(count) {
        var numPages = Math.ceil(count / ctrl.rowsPerPage);
        var onLastPage = (ctrl.currentPage === numPages);
        if (onLastPage) {
          lodash.last(ctrl.rows).isVeryEarliest = true;
        }
        ctrl.totalRows = count;
        $scope.$apply();
        $interval.cancel(refreshCurrentEntryTime);
        $interval(refreshCurrentEntryTime, 100);
      });
    };

    var refreshCurrentEntryTime = function() {
      if (ctrl.rows.length !== 0) {
        ctrl.rows[0].ended = (
          (ctrl.currentPage === 1) ?
          moment().valueOf() :
          ctrl.retrievedEntries[0].startedAt
        );
      }
    };

    var reset = function() {
      ctrl.entry = new Entry({ activityName: '' });
      ctrl.formErrors = [];
      loadPaginatedEntries(ctrl.currentPage);
    };

    ctrl.pageChanged = loadPaginatedEntries;

    ctrl.addEntry = function() {
      var oldHasStartedAt = ('startedAt' in ctrl.entry);
      var oldStartedAt = ctrl.entry.startedAt;
      ctrl.entry.startedAt = moment().valueOf();
      Activity.find({
        selector: { name: ctrl.entry.activityName },
        limit: 1,
        fields: ['_id']
      }).then(function(result) {
        if (ctrl.entry.activityName.length === 0) {
          return ctrl.entry.save();
        } else if (result.docs.length === 0) {
          var message = 'There is no activity with this name. Do you want to create a new ' +
            'activity with this name and switch to that?';
          if ($window.confirm(message)) {
            var newActivity = new Activity({ name: ctrl.entry.activityName });
            return newActivity.save().then(function(result) {
              ctrl.entry.activityId = result.id;
              return ctrl.entry.save();
            });
          } else {
            return $q.reject();
          }
        } else {
          ctrl.entry.activityId = result.docs[0]._id;     
          return ctrl.entry.save();
        }
      }).then(reset).catch(function(error) {
        if (oldHasStartedAt) {
          ctrl.entry.startedAt = oldStartedAt;
        } else {
          delete ctrl.entry.startedAt;
        }
        return $q.reject(error);
      });
    };

    // TODO Do we also want to enable the user to add an entry in between existing
    // ones?
    ctrl.removeEntry = function(row) {
      var message = (
        row.isVeryEarliest ?
        'Are you sure you want to delete this stint?' :
        'This stint will be deleted and the stint before it will be extended to fill the ' +
          'resulting gap. Do you want to proceed?'
      );
      if ($window.confirm(message)) {
        row.entry.remove().then(reset);
      }
    };

    ctrl.sourceActivityName = function(query, syncResults, asyncResults) {
      Activity.find({
        selector: { name: { $gte: '' } },  // Get all activities. TODO Make nicer.
        sort: ['name']
      }).then(function(result) {
        var regex = new RegExp(query);
        var results = lodash.chain(result.docs)
          .filter(function(activity) {
            return regex.test(activity.name);
          })
          .map(function(activity) {
            return activity.name;
          })
          .value();
        return asyncResults(results);
      });
    };

    reset();
  });
