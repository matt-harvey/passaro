'use strict';

/**
 * @ngdoc service
 * @name passaroApp.Store
 * @description
 * # Store
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  .service('Store', function($log, lodash, pouchDB) {
    var service = this;

    var constructorRegistry = {};

    /**
     * @return constructor for an already registered class.
     */
    service.getClass = function(className) {
      if (typeof constructorRegistry[className] === 'undefined') {
        throw 'A class has not been registered with Store with the name "' + className + '".';
      }
      return constructorRegistry[className];
    };

    /**
     * @param className [string] name of the class being registered
     * @param options [object] an options object with the following keys:
     *   defaultAttributes: an object with attribute names and their defaults
     *   additionalInstanceMethods: an object with additional methods to be merged in
     */
    service.registerClass = function(className, options) {
      var opts = lodash.merge({
        defaultAttributes: {},
        additionalInstanceMethods: {},
        additionalClassMethods: {}
      }, options);

      if (typeof constructorRegistry[className] !== 'undefined') {
        throw 'A class has already been registered with Store with the name "' + className + '".';
      }

      // constructor for the new class
      var Konstructor = function(attributes) {
        lodash.merge(this, opts.defaultAttributes, attributes);
      };

      constructorRegistry[className] = Konstructor;

      var database = pouchDB(className);

      var instanceCache;

      var markStale = function() {
        instanceCache = undefined;
      };
      var load = function() {
        if (typeof instanceCache === 'undefined') {
          database.allDocs({
            'include_docs': true,  // quotes to appease linter
            descending: true
          }).then(function(result) {
            instanceCache = lodash.map(result.rows, function(row) {
              return new Konstructor(row.doc);
            });
          }).catch(function(error) {
            // TODO Is there anything more useful we can do here? Should we throw?
            $log.error(error);
          });
        }
      };

      // wire up class methods for the new class
      lodash.merge(Konstructor, opts.additionalClassMethods, {

        /**
         * @return an array of all the instances of class
         */
        all: function() {
          load();
          return instanceCache;
        },

        /**
         * @param query e.g. { name: 'admin' }
         * @return true if an instance of class exists satisfying query, otherwise return false.
         */
        exists: function(query) {
          // TODO This should use a proper PouchDB query.
          return typeof Konstructor.findWhere(query) !== 'undefined';
        },

        /**
         * @param query e.g. { name: 'admin }
         * @return the first instance of class found that satisfies query, or undefined if no
         *   such instance is found.
         */
        findWhere: function(query) {
          // TODO This should use a proper PouchDB query.
          return lodash.findWhere(Konstructor.all(), query);
        }
      });

      // wire up instance methods for the new class
      lodash.merge(Konstructor.prototype, opts.additionalInstanceMethods, {

        /**
         * Save record to database. If _id matches that of existing record of this class, update
         * that record accordingly; otherwise, insert the new record. If record does not
         * have _id, it will be provided automatically.
         */
        save: function() {
          var that = this;
          var oldHasId = ('_id' in that);
          var oldHasRev = ('_rev' in that);
          var oldId = that._id;
          var oldRev = that._rev;
          if (!oldHasId) {
            that._id = new Date().toISOString();
          }
          var revert = function() {
            if (oldHasId) {
              that._id = oldId;
            } else {
              delete that._id;
            }
            if (oldHasRev) {
              that._rev = oldRev;
            } else {
              delete that._rev;
            }
          };
          database.put(that).then(function(result) {
            if (result.ok) {
              markStale();
            } else {
              // TODO Is there anything more useful we can do here? Should we throw?
              $log.error('Could not save record.');
              revert();
            }
          }).catch(function(error) {
            // TODO Is there anything more useful we can do here? Should we throw?
            $log.error(error);
            revert();
          });
        },

        /**
         * Remove record from database.
         */
        remove: function() {
          var that = this;
          database.remove(that).then(function(result) {
            if (result.ok) {
              markStale();
            } else {
              // TODO Is there anything more useful we can do here? Should we throw?
              $log.error('Could not remove record.');
            }
          }).catch(function(error) {
            // TODO Is there anything more useful we can do here? Should we throw?
            $log.error(error);
          });
        }
      });

      return Konstructor;
    };
  });
