'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:EntriesCtrl
 * @description
 * # EntriesCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('EntriesCtrl', function($log, $q, $scope, $window, lodash, moment, Activity,
    Entry) {
    // TODO A lot of code is similar to that in controllers/activities.js. Factor out the
    // shared stuff.

    var ctrl = this;

    // pagination state
    ctrl.rows = [];
    ctrl.rowsPerPage = 5;
    ctrl.currentPage = 1;
    ctrl.totalRows = 0;

    var loadPaginatedEntries = function(pageNumber) {
      Entry.find({
        selector: { startedAt: { $gte: 0 } },  // Get all entries. (Can this be done less hackily?)
        limit: ctrl.rowsPerPage,
        skip: ctrl.rowsPerPage * (pageNumber - 1),  // TODO This is not performant.
        sort: [{ startedAt: 'desc' }]
      }).then(function(result) {
        ctrl.rows = lodash.map(result.docs, function(doc) {
          return { entry: new Entry(doc) };
        });
        lodash.each(ctrl.rows, function(row) {
          row.entry.findActivity().then(function(result) {
            row.activity = result;
          });
        });
        return Entry.count();
      }).then(function(result) {
        ctrl.totalRows = result;
        $scope.$apply();
      });
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

    ctrl.removeEntry = function(entry) {
      if ($window.confirm('Are you sure you want to delete this entry?')) {
        entry.remove().then(reset);
      }
    };

    reset();
  });
