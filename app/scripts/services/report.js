'use strict';

/**
 * @ngdoc service
 * @name passaroApp.Report
 * @description
 * # Report
 * Service in the passaroApp.
 */
angular.module('passaroApp')
  .service('Report', function(lodash, moment, Entry) {
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
      var previousEntry = { activityName: '', startedAt: startTimeMs };
      
      return Entry.find({
        selector: { startedAt: { $gte: 0 } },  // Get all. (Can this be done less hackily?)
        sort: [{ startedAt: 'asc' }]
      }).then(function(result) {
        result.docs.push({ activityName: '', startedAt: endTimeMs });
        lodash.each(result.docs, function(entry/*, index*/) {
          var previousTotal, stintDuration;
          var stintActivityName = previousEntry.activityName;
          var stintBegins = Math.max(previousEntry.startedAt, startTimeMs);
          var stintEnds = Math.min(entry.startedAt, endTimeMs);
          if (
            stintActivityName &&
            (stintEnds >= startTimeMs) && (stintBegins <= endTimeMs) &&
            activityNameRegex.test(stintActivityName)
          ) {
            previousTotal = (activitiesMap[stintActivityName] || 0);
            stintDuration = stintEnds - stintBegins;
            activitiesMap[stintActivityName] = previousTotal + stintDuration;
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
