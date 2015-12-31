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
    return Store.registerClass('Activity', {
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
