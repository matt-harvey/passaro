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
      { path: '/reports', title: 'Reports' },
      { path: '/activities', title: 'Activities' },
      { path: '/entries', title: 'Entries' }
    ];

    that.isActive = function(item) {
      return item.path === $location.path();
    };
  });
