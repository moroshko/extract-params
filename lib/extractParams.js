var paramRegex = /:[a-zA-Z]+/g;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function identity(params) {
  return params;
}

module.exports = function extractParams(str, pattern, transform) {
  if (typeof str !== 'string') {
    throw new Error('\'str\' must be a string');
    return null;
  }

  if (typeof pattern !== 'string') {
    throw new Error('\'pattern\' must be a string');
    return null;
  }

  if (typeof transform === 'undefined') {
    transform = identity;
  } else if (typeof transform !== 'function') {
    throw new Error('\'transform\' must be a function');
    return null;
  }

  var valuesRegex = new RegExp('^' + pattern.split(paramRegex).map(function(patternPart) {
    return escapeRegexCharacters(patternPart);
  }).join('(.+)') + '$');

  var valuesMatch = str.match(valuesRegex);

  if (valuesMatch === null) {
    return null;
  }

  var paramsMatch = pattern.match(paramRegex);

  if (paramsMatch === null) {
    return transform({});
  }

  var params = paramsMatch.map(function(param) {
    return param.slice(1); // remove leading ':'
  });

  return transform(valuesMatch.slice(1).reduce(function(result, value, index) {
    result[params[index]] = value;
    return result;
  }, {}));
};
