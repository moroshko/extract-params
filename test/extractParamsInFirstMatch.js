var expect = require('chai').expect;
var extractParamsInFirstMatch = require('../lib/extractParamsInFirstMatch');

function userIdValidator(params) {
  if (!('userId' in params)) {
    return params;
  }

  // Without this check, '/users/1234/friends/567' would match '/users/:userId'
  // with { userId: '1234/friends/567' }
  if (!(/^\d+$/.test(params.userId))) {
    return null;
  }

  var userId = parseInt(params.userId, 10);

  return userId >= 1 && userId <= 999 ? params : null;
}

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
      { pattern: 'he-said-that-:language-is-:description' },
      { pattern: '/user/:userId/friends/:friendId' },
      { pattern: ':who-knows-that-:language-is-great' }
    ],
    result: null
  },
  {
    should: 'return the first match',
    str: '/users/123',
    patterns: [
      { pattern: '/users/:userId/friends/:friendId/photo' },
      { pattern: '/users/:userId/friends/:friendId' },
      { pattern: '/users/:userId/friends' },
      { pattern: '/users/:userId' },
      { pattern: '/users' }
    ],
    result: {
      patternIndex: 3,
      params: {
        userId: '123'
      }
    }
  },
  {
    should: 'use the transform function to return the first match',
    str: '/users/1234/friends/456',
    patterns: [
      { pattern: '/users/:userId/friends/:friendId/photo', transform: userIdValidator },
      { pattern: '/users/:userId/friends/:friendId', transform: userIdValidator },
      { pattern: '/users/:userId/friends', transform: userIdValidator },
      { pattern: '/users/:userId', transform: userIdValidator },
      { pattern: '/users' }
    ],
    result: null
  }
];

describe('extractParamsInFirstMatch should', function() {
  testCases.forEach(function(testCase) {
    it(testCase.should, function() {
      expect(extractParamsInFirstMatch(testCase.str, testCase.patterns)).to.deep.equal(testCase.result);
    });
  });
});
