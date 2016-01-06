var isString = require('lodash.isstring');
var isArray = require('lodash.isarray');
var extractParams = require('./extractParams');

module.exports = function extractParamsInFirstMatch(str, patterns) {
  if (!(isString(str))) {
    throw new Error('\'str\' must be a string');
    return null;
  }

  if (!(isArray(patterns))) {
    throw new Error('\'patterns\' must be an array');
    return null;
  }

  var patternsCount = patterns.length;

  for (var i = 0; i < patternsCount; i++) {
    var params = extractParams(str, patterns[i]);

    if (params !== null) {
      return {
        patternIndex: i,
        params: params
      };
    }
  }

  return null;
};
