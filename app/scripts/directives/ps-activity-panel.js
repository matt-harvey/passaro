'use strict';

/**
 * @ngdoc directive
 * @name passaroApp.directive:psActivityPanel
 * @description
 * # psActivityPanel
 */
angular.module('passaroApp')
  .directive('psActivityPanel', function() {
    return {
      controller: 'ActivityPanelCtrl',
      controllerAs: 'activityPanelCtrl',
      templateUrl: 'views/templates/ps-activity-panel.html',
      restrict: 'E'
    };
  });
