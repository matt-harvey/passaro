'use strict';

describe('Controller: ActivitiesCtrl', function () {

  // load the controller's module
  beforeEach(module('passaroApp'));

  var ActivitiesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivitiesCtrl = $controller('ActivitiesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ActivitiesCtrl.awesomeThings.length).toBe(3);
  });
});
