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

  // TODO tests...

});
