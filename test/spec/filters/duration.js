'use strict';

describe('Filter: duration', function () {

  // load the filter's module
  beforeEach(module('passaroApp'));

  // initialize a new instance of the filter before each test
  var duration, milliseconds;
  beforeEach(inject(function ($filter) {
    duration = $filter('duration');
    milliseconds = 12945020;
  }));

  describe('with "expanded" option not provided', function() {
    it('returns input number of milliseconds in hh:mm:ss format', function() {
      expect(duration(milliseconds)).toBe('03:35:45');
    });
  });

  describe('with option { expanded: false }', function() {
    it('returns input number of milliseconds in hh:mm:ss format', function() {
      expect(duration(milliseconds, { expanded: false })).toBe('03:35:45');
    });
  });

  describe('with option { expanded: true }', function() {
    it('returns input number of milliseconds in hh:mm:ss format followed by ' +
      'parenthesised decimal hours', function() {
      expect(duration(milliseconds, { expanded: true })).toBe('03:35:45 (3.6 hrs)');
    });
  });

});
