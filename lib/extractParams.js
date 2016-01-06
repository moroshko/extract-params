var assign = require('lodash.assign');
var isPlainObject = require('lodash.isplainobject');
var isString = require('lodash.isstring');
var isFunction = require('lodash.isfunction');
var isUndefined = require('lodash.isundefined');

var paramRegex = /:[a-zA-Z]+/g;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function identity(params) {
  return params;
}

function normalisePattern(pattern) {
  if (isString(pattern)) {
    return { pattern: pattern, caseSensitive: true, transform: identity };
  }

  if (isPlainObject(pattern)) {
    if (isUndefined(pattern.transform)) {
      return assign({ caseSensitive: true, transform: identity }, pattern);
    }

    if (isFunction(pattern.transform)) {
      return assign({ caseSensitive: true }, pattern);
    }

    throw new Error('\'transform\' must be a function');
    return null;
  }

  throw new Error('\'pattern\' must be a string or an object');
  return null;
}

module.exports = function extractParams(str, pattern) {
  var patternObj = normalisePattern(pattern);

  if (patternObj === null) {
    return null;
  }

  if (!isString(str)) {
    throw new Error('\'str\' must be a string');
    return null;
  }

  if (!(isString(patternObj.pattern))) {
    throw new Error('\'pattern\' value must be a string');
    return null;
  }

  var regexFlags = patternObj.caseSensitive ? '' : 'i';
  var valuesRegex = new RegExp('^' + patternObj.pattern.split(paramRegex).map(function(patternPart) {
    return escapeRegexCharacters(patternPart);
  }).join('(.+)') + '$', regexFlags);

  var valuesMatch = str.match(valuesRegex);

  if (valuesMatch === null) {
    return null;
  }

  var paramsMatch = patternObj.pattern.match(paramRegex);

  if (paramsMatch === null) {
    return patternObj.transform({});
  }

  var params = paramsMatch.map(function(param) {
    return param.slice(1); // remove leading ':'
  });

  return patternObj.transform(valuesMatch.slice(1).reduce(function(result, value, index) {
    result[params[index]] = value;
    return result;
  }, {}));
};
