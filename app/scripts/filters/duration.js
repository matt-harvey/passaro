'use strict';

/**
 * @ngdoc filter
 * @name passaroApp.filter:duration
 * @function
 * @description
 * # duration
 * Filter in the passaroApp.
 */
angular.module('passaroApp')
  .filter('duration', function($filter, moment) {
    return function(milliseconds, opts) {
      var basic = moment.duration(milliseconds).format('hh:mm:ss', { trim: false });
      if (opts.expanded) {
        var hours = milliseconds / 1000 / 60 / 60;
        return basic + ' (' + $filter('number')(hours, 1) + ' hours)';
      }
      return basic;
    };
  });
