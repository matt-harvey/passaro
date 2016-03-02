'use strict';

describe('Service: MultiSync', function () {

  // load the service's module
  beforeEach(module('passaroApp'));

  // instantiate service
  var MultiSync;
  beforeEach(inject(function (_MultiSync_) {
    MultiSync = _MultiSync_;
  }));

  it('should do something', function () {
    expect(!!MultiSync).toBe(true);
  });

});
