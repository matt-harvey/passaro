'use strict';

describe('Service: Report', function () {

  // load the service's module
  beforeEach(module('passaroApp'));

  // instantiate service
  var Report;
  beforeEach(inject(function (_Report_) {
    Report = _Report_;
  }));

  it('should do something', function () {
    expect(!!Report).toBe(true);
  });

});
