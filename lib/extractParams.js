var assign = require('lodash.assign');
var isPlainObject = require('lodash.isplainobject');

var paramRegex = /:[a-zA-Z]+/g;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function identity(params) {
  return params;
}

function normalisePattern(inputPattern) {
  return isPlainObject(inputPattern) ?
    assign({ caseSensitive: true }, inputPattern) :
    { pattern: inputPattern, caseSensitive: true };
}

module.exports = function extractParams(str, inputPattern) {
  var pattern = normalisePattern(inputPattern);

  if (typeof str !== 'string') {
    throw new Error('\'str\' must be a string');
    return null;
  }

  if (typeof pattern.pattern !== 'string') {
    throw new Error('\'pattern\' must be a string');
    return null;
  }

  if (typeof pattern.transform === 'undefined') {
    pattern.transform = identity;
  } else if (typeof pattern.transform !== 'function') {
    throw new Error('\'transform\' must be a function');
    return null;
  }

  var regexFlags = pattern.caseSensitive ? '' : 'i';
  var valuesRegex = new RegExp('^' + pattern.pattern.split(paramRegex).map(function(patternPart) {
    return escapeRegexCharacters(patternPart);
  }).join('(.+)') + '$', regexFlags);

  var valuesMatch = str.match(valuesRegex);

  if (valuesMatch === null) {
    return null;
  }

  var paramsMatch = pattern.pattern.match(paramRegex);

  if (paramsMatch === null) {
    return pattern.transform({});
  }

  var params = paramsMatch.map(function(param) {
    return param.slice(1); // remove leading ':'
  });

  return pattern.transform(valuesMatch.slice(1).reduce(function(result, value, index) {
    result[params[index]] = value;
    return result;
  }, {}));
};
