var extractParams = require('./extractParams');

module.exports = function extractParamsInFirstMatch(str, patterns) {
  if (typeof str !== 'string') {
    throw new Error('\'str\' must be a string');
    return null;
  }

  if (typeof patterns !== 'object' || typeof patterns.length === 'undefined') {
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
