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
      var klass = Store.getClass(args.klass);
      var query = {};
      query[args.key] = value;
      return !klass.exists(query);
    };
  });
