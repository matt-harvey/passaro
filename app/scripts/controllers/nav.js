'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('NavCtrl', function($location) {
    var that = this;

    that.rootItem = { path: '/', title: 'Passaro' };

    that.items = [
      { path: '/entries', title: 'Stints' },
      { path: '/activities', title: 'Activities' },
      { path: '/reports', title: 'Reports' },
      { path: '/about', title: 'About' }
    ];

    that.isActive = function(item) {
      return item.path === $location.path();
    };
  });
