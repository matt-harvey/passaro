'use strict';

/**
 * @ngdoc service
 * @name passaroApp.TimeLog
 * @description
 * # TimeLog
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  .service('TimeLog', function($log, lodash, pouchDB) {
    var that = this;
    var activities;
    var db;

    var initialize = function() {
      db = pouchDB('passaro');
      loadActivities();
    };

    var loadActivities = function() {
      db.allDocs({
        'include_docs': true,
        descending: true
      }).then(function(result) {
        activities = lodash.pluck(result.rows, 'doc');
      }, function(error) {
        // TODO Is there anything more useful we can do here?
        $log.error(error);
      });
    };

    that.activities = function() {
      return activities;
    };

    that.addActivity = function(activity) {
      db.put(activity, new Date().toISOString()).then(function(result) {
        if (result.ok) {
          loadActivities();
        } else {
          // TODO Is there anything more useful we can do here?
          $log.error('Could not add activity');
        }
      }, function(error) {
        // TODO Is there anything more useful we can do here?
        $log.error(error);
      });
    };

    that.removeActivity = function(activity) {
      db.remove(activity).then(function(result) {
        if (result.ok) {
          loadActivities();
        } else {
          // TODO Is there anything more useful we can do here?
          $log.error('Could not remove activity');
        }
      }, function(error) {
        // TODO Is there anything more useful we can do here?
        $log.error(error);
      });
    };

    initialize();
  });
