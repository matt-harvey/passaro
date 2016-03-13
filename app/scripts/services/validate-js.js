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

    // Override validate.Promise to use a constructor that is compatible with $q promises;
    // this avoids problems on Opera, Android browser and possible others.
    validate.Promise = $q;

    /**
     * Asynchronous validator to check for uniqueness of the given attribute (key)
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

    /**
     * Asynchronous validator to check for existence of the given attribute (key) as the _id of
     * a record in another data store. The other data store should be returned by the
     * function passed to the "getClass" option. But if given attribute is not present
     * then this validation always passes.
     */
    validate.validators.linked = function(value, options /* key, attributes */) {
      if (typeof value === 'undefined' || value === '' || value === null) {
        return $q.resolve();
      }
      return options.getClass().find({
        selector: { _id: value },
        limit: 1
      }).then(function(result) {
        return (
          result.docs.length === 0 ?
          $q.resolve(options.message || 'does not exist') :
          $q.resolve()
        );
      });
    };

    return {
      validate: validate
    };
  });
