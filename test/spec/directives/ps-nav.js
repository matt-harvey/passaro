'use strict';

describe('Directive: psNav', function () {

  // load the directive's module
  beforeEach(module('passaroApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ps-nav></ps-nav>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the psNav directive');
  }));
});
