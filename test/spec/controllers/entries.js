'use strict';

describe('Controller: EntriesCtrl', function () {

  // load the controller's module
  beforeEach(module('passaroApp'));

  var EntriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EntriesCtrl = $controller('EntriesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EntriesCtrl.awesomeThings.length).toBe(3);
  });
});
