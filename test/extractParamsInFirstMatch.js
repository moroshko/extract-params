var expect = require('chai').expect;
var extractParamsInFirstMatch = require('../lib/extractParamsInFirstMatch');

var testCases = [
  {
    should: 'return null if no patterns provided',
    str: 'everyone-knows-that-elm-is-awesome',
    patterns: [],
    result: null
  },
  {
    should: 'return null if none of the patterns match',
    str: 'everyone-knows-that-elm-is-awesome',
    patterns: [
      'he-said-that-:language-is-:description',
      '/user/:userId/friends/:friendId',
      ':who-knows-that-:language-is-great'
    ],
    result: null
  },
  {
    should: 'return the first match',
    str: '/users/123',
    patterns: [
      '/users/:userId/friends/:friendId/photo',
      '/users/:userId/friends/:friendId',
      '/users/:userId/friends',
      '/users/:userId',
      '/users'
    ],
    result: {
      pattern: '/users/:userId',
      params: {
        userId: '123'
      }
    }
  }
];

describe('extractParamsInFirstMatch should', function() {
  testCases.forEach(function(testCase) {
    it(testCase.should, function() {
      expect(extractParamsInFirstMatch(testCase.str, testCase.patterns)).to.deep.equal(testCase.result);
    });
  });
});
