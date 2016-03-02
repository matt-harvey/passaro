'use strict';

/**
 * @ngdoc service
 * @name passaroApp.MultiSync
 * @description
 * # MultiSync
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  .service('MultiSync', function(lodash) {
    var service = this;

    /**
     * For each property e.g. "height" of sourceObject, initialize that property
     * on destinationObject from its values on sourceObject, and then set up a watch
     * so that changes to its value on destinationObject are always copied back
     * to sourceObject.
     */
    service.connect = function(scope, sourceObject, destinationObject, properties) {
      lodash.each(properties, function(property/*, index */) {
        destinationObject[property] = sourceObject[property];
        scope.$watch(function() {
          return destinationObject[property];
        }, function(newValue) {
          sourceObject[property] = newValue;
        });
      });
    };

  });
