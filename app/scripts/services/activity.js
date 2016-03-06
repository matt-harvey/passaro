'use strict';

/**
 * @ngdoc service
 * @name passaroApp.Activity
 * @description
 * # Activity
 * Factory in the passaroApp.
 */
angular.module('passaroApp')
  .factory('Activity', function($q, lodash, Store) {
    // TODO If we ever allow Activity names to be updated, we'll 
    // have to update the activityName field on any Entry instances using
    // the updated Activity also. The lack of transactions in PouchDB will
    // become frustrating at that point (especially given the lack of JOINs).
    // Think about moving to SyncedDB. To decouple things better, a
    // broadcaster/subscriber design might be the best one when we need
    // to sync changes across different models.
    return Store.registerClass('Activity', {
      additionalInstanceMethods: {
        isBlank: function() {
          return this.name.length === 0;
        },
        toString: function() {
          return this.name;
        }
      },
      constraints: {
        name: {
          presence: true,
          uniqueness: {
            getClass: function() {
              return Store.getClass('Activity');
            }
          }
        }
      },
      defaultAttributes: {
        name: ''
      },
      indexes: [
        {
          index: {
            fields: ['name']
          }
        }
      ]
    });
  });
