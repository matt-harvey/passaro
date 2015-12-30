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
  }).config(function(valdrProvider) {
    valdrProvider.addConstraints({
      Activity: {
        name: {
          required: {
            message: 'Name is required'
          },
          unique: {
            key: 'name',
            message: 'There is already an activity with this name',
            klass: 'Activity'
          }
        }
      }
    });
  });
