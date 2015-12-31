'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:EntriesCtrl
 * @description
 * # EntriesCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('EntriesCtrl', function($log, lodash, Entry) {
    // TODO A lot of code is similar to that in controllers/activities.js. Factor out the
    // shared stuff.

    var ctrl = this;

    // pagination state
    ctrl.shownEntries = [];
    ctrl.entriesPerPage = 5;
    ctrl.pagination = { current: 1 };
    ctrl.numEntries = 0;

    var loadPaginatedEntries = function(pageNumber) {
      Entry.find({
        selector: { startedAt: { $gte: '' } },  // Get all entries. (Can this be done less hackily?)
        limit: ctrl.entriesPerPage,
        skip: ctrl.entriesPerPage * (pageNumber - 1),
        sort: ['startedAt']
      }).then(function(result) {
        ctrl.shownEntries = lodash.map(result.docs, function(doc) {
          return new Entry(doc);
        });
        // update the number of entries
        Entry.info().then(function(result) {
          ctrl.numEntries = result.doc_count;
        });
      });
    };

    var reset = function() {
      $log.info('DEBUG ctrl.entry'); $log.info(ctrl.entry);
      ctrl.entry = new Entry();
      loadPaginatedEntries(ctrl.pagination.current);
    };

    ctrl.pageChanged = loadPaginatedEntries;

    ctrl.addEntry = function() {
      $log.info('DEBUG');
      ctrl.entry.save().then(reset).catch(function(error) {
        $log.error(error);  // DEBUG
      });
    };

    reset();
  });
