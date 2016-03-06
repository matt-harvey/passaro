'use strict';

describe('Directive: psTypeahead', function () {

  // load the directive's module
  beforeEach(module('passaroApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ps-typeahead></ps-typeahead>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the psTypeahead directive');
  }));
});
