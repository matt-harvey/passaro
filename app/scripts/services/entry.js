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
      constraints: {
        activityId: {
          presence: true,
          linked: {
            getClass: function() {
              return Store.getClass('Activity');
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
