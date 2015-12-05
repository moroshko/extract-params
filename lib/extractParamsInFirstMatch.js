var extractParams = require('./extractParams');

module.exports = function extractParamsInFirstMatch(str, patterns) {
  var patternsCount = patterns.length;

  for (var i = 0; i < patternsCount; i++) {
    var params = extractParams(str, patterns[i]);

    if (params !== null) {
      return {
        pattern: patterns[i],
        params: params
      };
    }
  }

  return null;
};
