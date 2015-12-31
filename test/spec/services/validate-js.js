'use strict';

describe('Service: ValidateJS', function () {

  // load the service's module
  beforeEach(module('passaroApp'));

  // instantiate service
  var ValidateJS;
  beforeEach(inject(function (_ValidateJS_) {
    ValidateJS = _ValidateJS_;
  }));

  it('should do something', function () {
    expect(!!ValidateJS).toBe(true);
  });

});
