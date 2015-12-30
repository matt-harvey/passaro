'use strict';

/**
 * @ngdoc service
 * @name passaroApp.uniquenessValidator
 * @description
 * # uniquenessValidator
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  .service('uniquenessValidator', function(Store) {
    var validator = this;

    validator.name = 'unique';

    validator.validate = function(value, args) {
      // TODO Query using PouchDB instead of looking through the entire array of instances
      // like this (though will require dealing with asynchronous API).
      var klass = Store.getClass(args.klass);
      var query = {};
      query[args.key] = value;
      return !klass.exists(query);
    };
  });
