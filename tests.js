var expect = require('chai').expect;
var extractParams = require('./index');

var testCases = [
  {
    should: 'not find any parameters if there is no match',
    str: 'everyone-knows-that-elm-is-awesome',
    pattern: 'he-said-that-:language-is-:description',
    result: {}
  },
  {
    should: 'not find any parameters if matches but not at the start',
    str: 'she-said-that-elm-is-awesome',
    pattern: 'he-said-that-:language-is-:description',
    result: {}
  },
  {
    should: 'not find any parameters if pattern has no parameters',
    str: 'react-is-awesome',
    pattern: 'awesome',
    result: {}
  },
  {
    should: 'find parameter',
    str: 'my-name-is-Misha',
    pattern: 'my-name-is-:name',
    result: {
      name: 'Misha'
    }
  },
  {
    should: 'find multiple parameters',
    str: '/users/123/friends/456/photo',
    pattern: '/users/:userId/friends/:friendId/photo',
    result: {
      userId: '123',
      friendId: '456'
    }
  },
  {
    should: 'handle special characters in the pattern',
    str: 'my+name-is-Misha',
    pattern: 'my+name-is-:name',
    result: {
      name: 'Misha'
    }
  },
  {
    should: 'handle many special characters in the pattern',
    str: 'my(name}-is-Misha-{${Moroshko[[',
    pattern: 'my(name}-is-:firstName-{${:lastName[[',
    result: {
      firstName: 'Misha',
      lastName: 'Moroshko'
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
