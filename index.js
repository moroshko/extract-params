var paramRegex = /:[a-z]+/g;

module.exports = function extractParams(str, pattern) {
  var paramsMatch = pattern.match(paramRegex);

  if (paramsMatch === null) {
    return {};
  }

  var params = paramsMatch.map(function(param) {
    return param.slice(1); // remove leading ':'
  });

  var valuesRegex = new RegExp('^' + pattern.replace(paramRegex, '(.+)'));
  var valuesMatch = str.match(valuesRegex);

  if (valuesMatch === null) {
    return {};
  }

  return valuesMatch.slice(1).reduce(function(result, value, index) {
    result[params[index]] = value;
    return result;
  }, {});
};
