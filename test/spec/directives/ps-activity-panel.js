'use strict';

describe('Directive: psActivityPanel', function () {

  // load the directive's module
  beforeEach(module('passaroApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ps-activity-panel></ps-activity-panel>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the psActivityPanel directive');
  }));
});
