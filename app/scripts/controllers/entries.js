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
    Activity, Entry) {
    // TODO A lot of code is similar to that in controllers/activities.js. Factor out the
    // shared stuff.

    var ctrl = this;

    // pagination state
    ctrl.retrievedEntries = [];
    ctrl.rows = [];
    ctrl.rowsPerPage = 5;
    ctrl.currentPage = 1;
    ctrl.totalRows = 0;

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
          return { entry: entry };
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
          row.entry.findActivity().then(function(result) {
            row.activity = result;
          });
        });
        return Entry.count();
      }).then(function(result) {
        ctrl.totalRows = result;
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
      ctrl.entry = new Entry();
      loadPaginatedEntries(ctrl.currentPage);
      
    };

    ctrl.pageChanged = loadPaginatedEntries;

    ctrl.addEntry = function() {
      var oldHasStartedAt = ('startedAt' in ctrl.entry);
      var oldStartedAt = ctrl.entry.startedAt;
      ctrl.entry.startedAt = moment().valueOf();
      ctrl.entry.save().then(reset).catch(function(error) {
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
    ctrl.removeEntry = function(entry) {
      // FIXME If this is the very first entry, then this message will be misleading.
      if ($window.confirm(
        'This stint will be deleted and the stint before it will be lengthened to fill the ' +
        'resulting gap. Proceed?'
      )) {
        entry.remove().then(reset);
      }
    };

    reset();
  });
