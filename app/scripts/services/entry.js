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
