'use strict';

describe('Service: TimeLog', function () {

  // load the service's module
  beforeEach(module('passaroApp'));

  // instantiate service
  var TimeLog;
  beforeEach(inject(function (_TimeLog_) {
    TimeLog = _TimeLog_;
  }));

  it('should do something', function () {
    expect(!!TimeLog).toBe(true);
  });

});
