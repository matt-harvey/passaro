'use strict';

/**
 * @ngdoc service
 * @name passaroApp.Entry
 * @description
 * # Entry
 * Factory in the passaroApp.
 */
angular.module('passaroApp')
  .factory('Entry', function(lodash, Activity, Store) {
    return Store.registerClass('Entry', {
      additionalInstanceMethods: {
        // TODO There should be a general "find one by id" method in Store.
        findActivity: function() {
          var entry = this;
          return Activity.find({
            selector: { _id: entry.activityId },
            limit: 1
          }).then(function(result) {
            return result.docs[0];
          });
        }
      },
      constraints: {
        activityId: {
          presence: true,
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
