'use strict';

/**
 * @ngdoc service
 * @name passaroApp.Report
 * @description
 * # Report
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  .service('Report', function(lodash, Entry) {
    var service = this;

    /**
     * @return Report data as an array of objects 
     *   [
     *     { activityName: <activity-name>, duration: <duration-in-milliseconds> },
     *     etc..
     *   ]
     */
    service.generate = function(activityName, startTimeMs, endTimeMs) {
      
      var activityNameRegex = new RegExp(activityName);
      var activitiesMap = {};
      var previousEntry;
      
      return Entry.find({
        selector: { startedAt: { $gte: 0 } },  // Get all. (Can this be done less hackily?)
        sort: [{ startedAt: 'asc' }]
      }).then(function(result) {
        lodash.each(result.docs, function(entry/*, index*/) {
          var entryActivityName = entry.activityName;
          if (entryActivityName && activityNameRegex.test(entryActivityName)) {
            var previousTotal = (activitiesMap[entryActivityName] || 0);
            activitiesMap[entryActivityName] = previousTotal + 1;  // FIXME put duration.
          }
          previousEntry = entry;
        });
        return lodash.chain(activitiesMap)
          .map(function(value, key) {
            return { activityName: key, duration: value };
          })
          .sortBy(function(item) {
            return item.activityName;
          })
          .value();

      });
    };
  });
