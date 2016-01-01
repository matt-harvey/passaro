'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:EntriesCtrl
 * @description
 * # EntriesCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('EntriesCtrl', function($log, $q, $scope, lodash, moment, Entry) {
    // TODO A lot of code is similar to that in controllers/activities.js. Factor out the
    // shared stuff.

    var ctrl = this;

    // pagination state
    ctrl.shownEntries = [];
    ctrl.entriesPerPage = 5;
    ctrl.currentPage = 1;
    ctrl.numEntries = 0;

    var loadPaginatedEntries = function(pageNumber) {
      Entry.find({
        selector: { startedAt: { $gte: '' } },  // Get all entries. (Can this be done less hackily?)
        limit: ctrl.entriesPerPage,
        skip: ctrl.entriesPerPage * (pageNumber - 1),  // TODO This is not performant.
        sort: [{ startedAt: 'desc' }]
      }).then(function(result) {
        ctrl.shownEntries = lodash.map(result.docs, function(doc) {
          return new Entry(doc);
        });
        return Entry.count();
      }).then(function(result) {
        ctrl.numEntries = result;
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
      ctrl.entry.startedAt = moment();
      ctrl.entry.save().then(reset).catch(function(error) {
        if (oldHasStartedAt) {
          ctrl.entry.startedAt = oldStartedAt;
        } else {
          delete ctrl.entry.startedAt;
        }
        return $q.reject(error);
      });
    };

    reset();
  });
