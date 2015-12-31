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
      { path: '/entries', title: 'Entries' },
      { path: '/activities', title: 'Activities' },
      { path: '/reports', title: 'Reports' }
    ];

    that.isActive = function(item) {
      return item.path === $location.path();
    };
  });
