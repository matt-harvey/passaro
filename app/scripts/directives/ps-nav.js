'use strict';

/**
 * @ngdoc directive
 * @name passaroApp.directive:psNav
 * @description
 * # psNav
 */
angular.module('passaroApp')
  .directive('psNav', function() {
    return {
      controller: 'NavCtrl',
      controllerAs: 'navCtrl',
      templateUrl: 'views/templates/nav.html',
      restrict: 'E',
    };
  });
