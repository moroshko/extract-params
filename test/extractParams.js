var expect = require('chai').expect;
var extractParams = require('../lib/extractParams');

var testCases = [
  {
    should: 'throw an Error if str is not a string',
    str: 7,
    pattern: '/:language',
    throw: '\'str\' must be a string'
  },
  {
    should: 'throw an Error if pattern is not a string',
    str: 'elm',
    pattern: /:language/,
    throw: '\'pattern\' must be a string'
  },
  {
    should: 'throw an Error if transform is not a function',
    str: '/elm',
    pattern: {
      pattern: '/:language',
      transform: {}
    },
    throw: '\'transform\' must be a function'
  },
  {
    should: 'return null if there is no match',
    str: 'everyone-knows-that-elm-is-awesome',
    pattern: 'he-said-that-:language-is-:description',
    result: null
  },
  {
    should: 'return null if str has extra characters at the start',
    str: 'she-said-that-elm-is-awesome',
    pattern: 'he-said-that-:language-is-:description',
    result: null
  },
  {
    should: 'return null if str has extra characters at the end',
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
    should: 'use the transform function if there is match but the pattern has no parameters',
    str: 'react-is-awesome',
    pattern: {
      pattern: 'react-is-awesome',
      transform: function(params) {
        var newParams = {
          mood: 'awesome'
        };

        for (var param in params) {
          newParams[param] = params[param];
        }

        return newParams;
      }
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
    should: 'handle case insensitive patterns',
    str: 'My-Name-Is-Misha',
    pattern: { pattern: 'my-name-is-:name', caseSensitive: false },
    result: {
      name: 'Misha'
    }
  },
  {
    should: 'transform the extracted params using the transform function',
    str: '/users/123/friends/456/photo',
    pattern: {
      pattern: '/users/:userId/friends/:friendId/photo',
      transform: function(params) {
        var newParams = {};

        for (var param in params) {
          newParams[param] = '**' + params[param] + '**';
        }

        return newParams;
      }
    },
    result: {
      userId: '**123**',
      friendId: '**456**'
    }
  },
  {
    should: 'fail the match if the transform function returns null',
    str: '/users/1234/friends/456/photo',
    pattern: {
      pattern: '/users/:userId/friends/:friendId/photo',
      transform: function(params) {
        var userId = parseInt(params.userId, 10);

        return userId >= 1 && userId <= 999 ? params : null;
      }
    },
    result: null
  }
];

describe('extractParams should', function() {
  testCases.forEach(function(testCase) {
    it(testCase.should, function() {
      var fn = extractParams.bind(null, testCase.str, testCase.pattern);

      if (testCase.throw) {
        expect(fn).to.throw(testCase.throw);
      } else {
        expect(fn()).to.deep.equal(testCase.result);
      }
    });
  });
});
