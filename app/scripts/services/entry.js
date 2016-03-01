'use strict';

/**
 * @ngdoc service
 * @name passaroApp.Entry
 * @description
 * # Entry
 * Factory in the passaroApp.
 */
angular.module('passaroApp')
  .factory('Entry', function($q, lodash, moment, Activity, Store) {
    return Store.registerClass('Entry', {
      additionalInstanceMethods: {
        // TODO There should be a general "find one by id" method in Store.
        findActivity: function() {
          var entry = this;
          if (typeof entry.activityId === 'undefined' || entry.activityId === '') {
            return $q.resolve(new Activity());
          }
          return Activity.find({
            selector: { _id: entry.activityId },
            limit: 1
          }).then(function(result) {
            return new Activity(result.docs[0]);
          });
        },
      },
      additionalClassMethods: {
        findMostRecent: function() {
          var Entry = this;
          return Entry.find({
            selector: { startedAt: { $gt: 0 } },
            sort: [{ startedAt: 'desc' }],
            limit: 1
          }).then(function(result) {
            return new Entry(result.docs[0]);
          });
        }
      },
      // Sync activityName stored on the Entry with the name of the Activity
      // referenced by activityId. This is a workaround for the combination of
      // PouchDB's lack of transactions and its lack of JOINs. There is possibly
      // a better way.
      // TODO It feels like the lack of transactions is a bad enough thing that
      // the whole app might be better moved to SyncedDB, which *does* offer
      // transactions (but relies on IndexedDB). Then instead of this afterFind
      // stuff, we could have a broadcaster/subscriber type design, whereby - within
      // the same transaction - whenever an activity changes its name, it tells
      // all the subscribers (i.e. tables that are duplicating that attribute on
      // their own model) to update theirs as well. Then Activity wouldn't have
      // to know that Entry stores activityName, and all Entry would have to do
      // would be to subscribe to Activity's broadcast for its name attribute.
      afterFind: function(result) {
        var Entry = this;
        var retrievedEntries = lodash.map(result.docs, function(doc) {
          return new Entry(doc);
        });
        lodash.each(retrievedEntries, function(entry) {
          entry.findActivity().then(function(activity) {
            if (
              (typeof activity === 'undefined' && entry.activityName) ||
              (activity.name !== entry.activityName)
            ) {
              entry.activityName = activity.name;
              return entry.save();
            } else {
              return $q.resolve('unchanged');
            }
          });
        });
        return result;
      },
      constraints: {
        activityId: {
          linked: {
            getClass: function() {
              return Activity;
            }
          }
        },
        startedAt: {
          // FIXME Also need constraint for datetime / moment.
          presence: true
        }
      },
      defaultAttributes: {
        activityId: ''
      },
      indexes: [
        {
          index: {
            fields: ['activityId']
          }
        },
        {
          index: {
            fields: ['startedAt']
          }
        }
      ]
    });
  });
