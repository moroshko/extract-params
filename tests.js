var expect = require('chai').expect;
var extractParams = require('./index');

var testCases = [
  {
    should: 'find parameter',
    str: 'my-name-is-Misha',
    pattern: 'my-name-is-:name',
    result: {
      name: 'Misha'
    }
  }
];

describe('extractParams should', function() {
  testCases.forEach(function(testCase) {
    it(testCase.should, function() {
      expect(extractParams(testCase.str, testCase.pattern)).to.deep.equal(testCase.result);
    });
  });
});
