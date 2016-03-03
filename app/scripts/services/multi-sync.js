'use strict';

/**
 * @ngdoc service
 * @name passaroApp.MultiSync
 * @description
 * # MultiSync
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  // TODO MuliSync is no longer a good name for this Service.
  .service('MultiSync', function(lodash) {
    var service = this;
    var registers = {};

    /**
     * For each property e.g. "height" of sourceObject, initialize that property
     * on destinationObject using the initial value passed in properties object,
     * and then set up a watch so that changes to its value on destinationObject
     * are always copied back to this register.
     */
    service.connect = function(scope, masterKey, destinationObject, properties) {
      var initializing = false;
      if (typeof registers[masterKey] === 'undefined') {
        initializing = true;
        registers[masterKey] = {};
      }
      lodash.each(properties, function(initialValue, property) {
        if (initializing) {
          registers[masterKey][property] = initialValue;
        }
        destinationObject[property] = registers[masterKey][property];
        scope.$watch(function() {
          return destinationObject[property];
        }, function(newValue) {
          registers[masterKey][property] = newValue;
        });
      });
    };

  });
