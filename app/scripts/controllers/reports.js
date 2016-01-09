'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('ReportsCtrl', function(moment) {
    var ctrl = this;

    // TODO Date pickers should be in a directive.

    var today = new Date();
    ctrl.startDate = today;
    ctrl.endDate = today;
    ctrl.activityName = '';
    ctrl.minDate = moment(today).subtract(100, 'year').startOf('year').toDate();
    ctrl.maxDate = moment(today).add(1, 'year').endOf('year').toDate();
    ctrl.altDateInputFormats = [];
    ctrl.datePickerOptions = {
      formatYear: 'yyyy',
      formatMonth: 'MM',
      formatDate: 'dd',
      startingDay: 1
    };
    ctrl.startDatePopup = { opened: false };
    ctrl.endDatePopup = { opened: false };
    
    ctrl.openStartDate = function() {
      ctrl.startDatePopup.opened = true;
    };
    ctrl.openEndDate = function() {
      ctrl.endDatePopup.opened = true;
    };
    ctrl.generate = function() {
      var startTimeMs = moment(ctrl.startDate).startOf('day').valueOf();
      var endTimeMs = moment(ctrl.endDate).endOf('day').valueOf(); 
    };
  });
