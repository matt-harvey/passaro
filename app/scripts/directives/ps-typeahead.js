'use strict';

/**
 * @ngdoc directive
 * @name passaroApp.directive:psTypeahead
 * @description
 * # psTypeahead
 */
angular.module('passaroApp')
  .directive('psTypeahead', function(lodash) {
    return {
      restrict: 'A',
      scope: {
        psTypeaheadSource: '=',
        psTypeaheadDestination: '='
      },
      link: function(scope, element/*, attrs*/) {
        element.typeahead({ minLength: 2 }, { limit: 20, source: scope.psTypeaheadSource });
        lodash.each(['autocomplete', 'cursorchange', 'select'], function(eventType) {
          element.on('typeahead:' + eventType, function(event, selection) {
            scope.psTypeaheadDestination = selection; 
          });
        });
      }
    };
  });
