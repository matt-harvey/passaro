'use strict';

/**
 * @ngdoc function
 * @name passaroApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the passaroApp
 */
angular.module('passaroApp')
  .controller('ReportsCtrl', function(moment, lodash, MultiSync, Report, $scope) {
    var ctrl = this;

    // TODO Date pickers should be in a directive.

    var today = new Date();

    var defaults = {
      startDate: today,
      endDate: today,
      activityName: '',
      reportItems: []
    };

    MultiSync.connect($scope, 'ReportsCtrl', ctrl, defaults);

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
      var startTimeMs = (ctrl.startDate ? moment(ctrl.startDate).startOf('day').valueOf() :
        Number.MIN_VALUE);
      var now = moment().valueOf();
      var endTimeMs = (ctrl.endDate ? Math.min(moment(ctrl.endDate).endOf('day').valueOf(), 
        now) : now);
      Report.generate(ctrl.activityName, startTimeMs, endTimeMs).then(function(reportItems) {
        ctrl.reportItems = reportItems;
        $scope.$apply();
      });
    };
    ctrl.clear = function() {
      ctrl.startDate = ctrl.endDate = ctrl.activityName = '';
      ctrl.reportItems = [];
    };
  });
