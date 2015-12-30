'use strict';

/**
 * @ngdoc service
 * @name passaroApp.Activity
 * @description
 * # Activity
 * Factory in the passaroApp.
 */
angular.module('passaroApp')
  .factory('Activity', function(Store) {
    return Store.registerClass('Activity', {
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
