var expect = require('chai').expect;
var extractParams = require('../lib/extractParams');

var testCases = [
  {
    should: 'return null if there is no match',
    str: 'everyone-knows-that-elm-is-awesome',
    pattern: 'he-said-that-:language-is-:description',
    result: null
  },
  {
    should: 'return null if there is match but not at the start',
    str: 'she-said-that-elm-is-awesome',
    pattern: 'he-said-that-:language-is-:description',
    result: null
  },
  {
    should: 'return null if there is match but not at the end',
    str: 'language-elm-is-awesome',
    pattern: 'language-:lang-is',
    result: null
  },
  {
    should: 'return {} if there is match but the pattern has no parameters',
    str: 'react-is-awesome',
    pattern: 'react-is-awesome',
    result: {}
  },
  {
    should: 'return use the transform function if there is match but the pattern has no parameters',
    str: 'react-is-awesome',
    pattern: 'react-is-awesome',
    transform: function(params) {
      var newParams = {
        mood: 'awesome'
      };

      for (var param in params) {
        newParams[param] = params[param];
      }

      return newParams;
    },
    result: {
      mood: 'awesome'
    }
  },
  {
    should: 'extract single parameter',
    str: 'my-name-is-Misha',
    pattern: 'my-name-is-:name',
    result: {
      name: 'Misha'
    }
  },
  {
    should: 'extract multiple parameters',
    str: '/users/123/friends/456/photo',
    pattern: '/users/:userId/friends/:friendId/photo',
    result: {
      userId: '123',
      friendId: '456'
    }
  },
  {
    should: 'handle special characters in the pattern',
    str: 'my(name}-is+Misha-{${Moroshko[[',
    pattern: 'my(name}-is+:firstName-{${:lastName[[',
    result: {
      firstName: 'Misha',
      lastName: 'Moroshko'
    }
  },
  {
    should: 'transform the extracted params using the transform function',
    str: '/users/123/friends/456/photo',
    pattern: '/users/:userId/friends/:friendId/photo',
    transform: function(params) {
      var newParams = {};

      for (var param in params) {
        newParams[param] = '**' + params[param] + '**';
      }

      return newParams;
    },
    result: {
      userId: '**123**',
      friendId: '**456**'
    }
  },
  {
    should: 'fail the match if the transform function returns null',
    str: '/users/1234/friends/456/photo',
    pattern: '/users/:userId/friends/:friendId/photo',
    transform: function(params) {
      var userId = parseInt(params.userId, 10);

      return userId >= 1 && userId <= 999 ? params : null;
    },
    result: null
  }
];

describe('extractParams should', function() {
  testCases.forEach(function(testCase) {
    it(testCase.should, function() {
      expect(extractParams(testCase.str, testCase.pattern, testCase.transform)).to.deep.equal(testCase.result);
    });
  });
});
