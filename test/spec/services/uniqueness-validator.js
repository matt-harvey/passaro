'use strict';

describe('Service: uniquenessValidator', function () {

  // load the service's module
  beforeEach(module('passaroApp'));

  // instantiate service
  var uniquenessValidator;
  beforeEach(inject(function (_uniquenessValidator_) {
    uniquenessValidator = _uniquenessValidator_;
  }));

  it('should do something', function () {
    expect(!!uniquenessValidator).toBe(true);
  });

});
