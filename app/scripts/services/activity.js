'use strict';

/**
 * @ngdoc service
 * @name passaroApp.Activity
 * @description
 * # Activity
 * Factory in the passaroApp.
 */
angular.module('passaroApp')
  .factory('Activity', function($log, lodash, pouchDB) {

    // TODO This has a lot of reusable code, which could be factored up into a base class
    // housed in a shared service.

    /**
     * IMPLEMENTATION DETAILS
     */

    var db = pouchDB('activities');
    var activities;

    // bookeeping for in-memory activities cache
    var loaded = true;
    var markStale = function() {
      loaded = false;
    };
    var load = function() {
      if (!loaded) {
        db.allDocs({
          'include_docs': true,  // pouchDB requires underscores here; quoting to appease linter
          descending: true
        }).then(function(result) {
          activities = lodash.map(result.rows, function(row) {
            return new Activity(row.doc);
          });
        }).catch(function(error) {
          // TODO Is there anything more useful we can do here? Should we throw?
          $log.error(error);
        });
        loaded = true;
      }
    };
    markStale();

    /**
     * PUBLIC API
     */

    /**
     * Constructor for individuals activities: use this with "new" to make an not-yet-persisted
     * activity.
     */
    var Activity = function(attributes) {
      lodash.merge(this, { name: '' }, attributes);
    };

    /**
     * class methods
     */

    /**
     * @return an array of all activiites.
     */
    Activity.all = function() {
      load();
      return activities;
    };

    /**
     * @param query e.g. { name: 'admin }
     * @return true if there is an activity with the attributes in query, otherwise false.
     */
    Activity.exists = function(query) {
      // TODO This should use a proper PouchDB query.
      return typeof Activity.findWhere(query) !== 'undefined';
    };

    /**
     * @param query object e.g. { name: 'admin' }
     * @return the first Activity found that matches query.
     */
    Activity.findWhere = function(query) {
      // TODO This should use a proper PouchDB query.
      return lodash.findWhere(Activity.all(), query);
    };

    /**
     * instance methods
     */

    /**
     * Save activity to database. If activity._id matches that of existing activity, update
     * that activity with this one; otherwise, insert the new activity. If activity does not
     * have _id, it will be provided automatically.
     */
    Activity.prototype.save = function() {
      var activity = this;
      var oldHasId = ('_id' in activity);
      var oldHasRev = ('_rev' in activity);
      var oldId = activity._id;
      var oldRev = activity._rev;
      if (!oldHasId) {
        activity._id = new Date().toISOString();
      }
      var revert = function() {
        if (oldHasId) {
          activity._id = oldId;
        } else {
          delete activity._id;
        }
        if (oldHasRev) {
          activity._rev = oldRev;
        } else {
          delete activity._rev;
        }
      };
      db.put(activity).then(function(result) {
        if (result.ok) {
          markStale();
        } else {
          // TODO Is there anything more useful we can do here? Should we throw?
          $log.error('Could not save activity.');
          revert();
        }
      }).catch(function(error) {
        // TODO Is there anything more useful we can do here? Should we throw?
        $log.error(error);
        revert();
      });
    };

    /**
     * Remove activity from database.
     */
    Activity.prototype.remove = function() {
      var activity = this;
      db.remove(activity).then(function(result) {
        if (result.ok) {
          markStale();
        } else {
          // TODO Is there anything more useful we can do here? Should we throw?
          $log.error('Could not remove activity.');
        }
      }).catch(function(error) {
        // TODO Is there anything more useful we can do here? Should we throw?
        $log.error(error);
      });
    };

    return Activity;
  });
