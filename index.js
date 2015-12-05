var paramRegex = /:[a-zA-Z]+/g;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = function extractParams(str, pattern) {
  var valuesRegex = new RegExp('^' + pattern.split(paramRegex).map(function(patternPart) {
    return escapeRegexCharacters(patternPart);
  }).join('(.+)'));

  var valuesMatch = str.match(valuesRegex);

  if (valuesMatch === null) {
    return null;
  }

  var paramsMatch = pattern.match(paramRegex);

  if (paramsMatch === null) {
    return {};
  }

  var params = paramsMatch.map(function(param) {
    return param.slice(1); // remove leading ':'
  });

  return valuesMatch.slice(1).reduce(function(result, value, index) {
    result[params[index]] = value;
    return result;
  }, {});
};
