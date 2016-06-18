'use strict';

/**
 * @ngdoc directive
 * @name passaroApp.directive:psDismissableMessage
 * @description
 * # psDismissableMessage
 */
angular.module('passaroApp')
  .directive('psDismissableMessage', function() {
    return {
      controller: function() {
        var that = this;
        that.visible = true;
        that.hide = function() {
          that.visible = false;   
        };
      },
      controllerAs: 'ctrl',
      templateUrl: 'views/templates/dismissable-message.html',
      restrict: 'E',
      transclude: true,
      link: function(scope, element) {
        element.find('.ps-dismissable-message-ok').click(function() {
          element.remove();
        });
      }
    };
  });
