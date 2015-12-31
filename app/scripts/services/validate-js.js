'use strict';

/**
 * @ngdoc service
 * @name passaroApp.ValidateJS
 * @description
 * # ValidateJS
 * Factory in the passaroApp.
 */
angular.module('passaroApp')
  .factory('ValidateJS', function($q, $window) {
    var validate = $window.validate;

    /**
     * Custom asynchronous validator to check for uniqueness of the given attribute (key)
     * against a given data store. As a workaround to avoid a circular dependency between
     * the Store service and ValidateJS service, the constraints object must contain a
     * "getClass" option, of which the value is a function that returns the class registered
     * with Store.
     */
    validate.validators.uniqueness = function(value, options, key /*, attributes */) {
      var selector = {};
      selector[key] = value;
      return options.getClass().find({
        selector: selector,
        limit: 1
      }).then(function(result) {
        return (
          result.docs.length === 0 ?
          $q.resolve() :
          $q.resolve(options.message || 'must be unique')
        );
      });
    };

    return {
      validate: validate
    };
  });
