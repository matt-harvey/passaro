'use strict';

/**
 * @ngdoc service
 * @name passaroApp.Store
 * @description
 * # Store
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  .service('Store', function($log, $q, lodash, pouchDB, ValidateJS) {
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
     *   additionalInstanceMethods: an object with additional instance methods to be merged in
     *   additionalClassMethods: an object with additional "class methods" to be merged in (these
     *     will be attached as properties to the constructor)
     *   indexes: an array of configuration objects each of which is passed to the pouchdb-find
     *     API to create an index
     */
    service.registerClass = function(className, options) {
      var opts = lodash.merge({
        constraints: {},
        defaultAttributes: {},
        additionalInstanceMethods: {},
        additionalClassMethods: {},
        indexes: []
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

      lodash.each(opts.indexes, function(index) {
        database.createIndex(index).catch(function(error) {
          // TODO Is there anything more useful we can do here? Should we throw?
          $log.error(error);
        });
      });

      // wire up class methods for the new class
      lodash.merge(Konstructor, opts.additionalClassMethods, {

        /**
         * @return a promise of which the result is the number of persisted records of this class.
         */
        count: function() {
          var num;
          return database.info().then(function(result) {
            // We start by counting all the documents...
            num = result.doc_count;
            return database.find({
              // ...then we count how many are special ones, like design docs, where the id begins
              // with an underscore. We will exclude these from the count.
              selector: { _id: { $gte: '_', $lte: '_\uffff' } },
              fields: []
            });
          }).then(function(result) {
            // FIXME Ensure people can't save records with an ID beginning with an underscore.
            // Also probably better we generate our own IDs after all, and give them all a
            // standard prefix or something to make querying easier.
            return num - result.docs.length;
          });
        },

        constraints: opts.constraints,

        info: function() {
          return database.info();
        },

        /**
         * @param query conforming to pouchdb-find API
         */
        find: function(query) {
          return database.find(query);
        },
      });

      // wire up instance methods for the new class
      lodash.merge(Konstructor.prototype, opts.additionalInstanceMethods, {

        errorsFor: function(attribute) {
          return this.errors ? (this.errors[attribute] || []) : [];
        },

        /**
         * Save record to database. If _id matches that of existing record of this class, update
         * that record accordingly; otherwise, insert the new record. If record does not
         * have _id, it will be provided automatically.
         */
        save: function() {
          var that = this;
          return that.validate().catch(function(errors) {
            that.errors = errors;
            return $q.reject('Instance of ' + className + ' is invalid');
          }).then(function() {
            var oldHasId = ('_id' in that);
            var oldHasRev = ('_rev' in that);
            var oldId = that._id;
            var oldRev = that._rev;
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
            return database[oldHasId ? 'put' : 'post'](that).then(function(result) {
              if (!result.ok) {
                // TODO Is there anything more useful we can do here? Should we throw?
                $log.error('Could not save record.');
                revert();
              }
            }).catch(function(error) {
              // TODO Is there anything more useful we can do here? Should we throw?
              $log.error(error);
              revert();
            });
          });
        },

        /**
         * Remove record from database.
         */
        remove: function() {
          var that = this;
          return database.remove(that).then(function(result) {
            if (!result.ok) {
              // TODO Is there anything more useful we can do here? Should we throw?
              $log.error('Could not remove record.');
            }
          }).catch(function(error) {
            // TODO Is there anything more useful we can do here? Should we throw?
            $log.error(error);
          });
        },

        /**
         * Asynchronously validate the record, returning a promise.
         */
        validate: function() {
          return ValidateJS.validate.async(this, Konstructor.constraints);
        }

      });

      return Konstructor;
    };
  });
