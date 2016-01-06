<a href="https://codeship.com/projects/119982" target="_blank">
  <img src="https://img.shields.io/codeship/ff47ba10-7c98-0133-b9e7-2e6bcf2dba9a/master.svg?style=flat-square"
       alt="Build Status" />
</a>
<a href="http://issuestats.com/github/moroshko/extract-params" target="_blank">
  <img src="http://issuestats.com/github/moroshko/extract-params/badge/pr?style=flat-square"
       alt="Pull Requests stats" />
</a>
<a href="https://npmjs.org/package/extract-params" target="_blank">
  <img src="https://img.shields.io/npm/dm/extract-params.svg?style=flat-square"
       alt="NPM Downloads" />
</a>
<a href="https://npmjs.org/package/extract-params" target="_blank">
  <img src="https://img.shields.io/npm/v/extract-params.svg?style=flat-square"
       alt="NPM Version" />
</a>

# Extract Params

## Installation

```shell
npm install extract-params --save
```

Then, in your app:

```js
var extractParams = require('extract-params').extractParams;
// or
var extractParamsInFirstMatch = require('extract-params').extractParamsInFirstMatch;
```

## API

* [`extractParams(str, pattern)`](#extractParams)
* [`extractParamsInFirstMatch(str, patterns)`](#extractParamsInFirstMatch)

<a name="extractParams"></a>
### extractParams(str, pattern)

Tests whether `str` matches the given parameterized [pattern](#patterns). If match is successful, it returns a hash of parameters and their values. Otherwise, `extractParams` returns `null`.

The match is considered successful only if `str` matches the `pattern` at the start and at the end (see examples 2 and 3 below).

#### Example 1

```js
var params = extractParams(
  '/users/123/friends/456/photo',
  '/users/:userId/friends/:friendId/photo'
);

/* 
  Returns:
    {
      userId: '123',
      friendId: '456'
    }
*/
```

#### Example 2

```js
var params = extractParams(
  '/home/users/123',
  '/users/:userId'
);

/* 
  Returns:
    null
      
  because `str` doesn't match the `pattern` at the start.
*/
```

#### Example 3

```js
var params = extractParams(
  '/users/123/friends/456',
  '/users/:userId/friends'
);

/* 
  Returns:
    null
      
  because `str` doesn't match the `pattern` at the end.
*/
```

#### Example 4

```js
var params = extractParams(
  '/USERS/123/Friends/456/photo',
  '/users/:userId/friends/:friendId/photo'
);

/* 
  Returns:
    null
    
  because the pattern is case sensitive by default
*/
```

<a name="case-insensitive-example"></a>
#### Example 5

```js
var params = extractParams(
  '/USERS/123/Friends/456/photo',
  {
    pattern: '/users/:userId/friends/:friendId/photo',
    caseSensitive: false
  }
);

/* 
  Returns:
    {
      userId: '123',
      friendId: '456'
    }
*/
```

<a name="lowercase-keys-example"></a>
#### Example 6

```js
function lowercaseValues(params) {
  return Object.keys(params).reduce(function(result, param) {
    result[param] = params[param].toLowerCase();
    return result;
  }, {});
}

var params = extractParams(
  '/users/Misha/friends/MARK/photo',
  {
    pattern: '/users/:user/friends/:friend/photo',
    transform: lowercaseValues
  }
);

/* 
  Returns:
    {
      user: 'misha',
      friend: 'mark'
    }
*/
```

<a name="regex-validation-example"></a>
#### Example 7

```js
var companyRegex = /[a-zA-Z]+/;
var employeeRegex = /[a-z\-]+/;

function validator(params) {
  return typeof params.company === 'string' && companyRegex.test(params.company) &&
         typeof params.employee === 'string' && employeeRegex.test(params.employee);
}

var params = extractParams(
  '/companies/Yahoo7/employees/david-brown',
  {
    pattern: '/companies/:company/employees/:employee',
    transform: validator
  }
);

/* 
  Returns:
    null
    
  because 'Yahoo7' contains a number
*/
```

<a name="extractParamsInFirstMatch"></a>
### extractParamsInFirstMatch(str, patterns)

Tests whether `str` matches one of the parameterized [patterns](#patterns). If none of the `patterns` match, `extractParamsInFirstMatch` returns `null`. Otherwise, it returns the matching pattern index and its parameters.

#### Example 1

```js
var params = extractParamsInFirstMatch(
  '/users/123',
  [
    { pattern: '/users/:userId/friends/:friendId/photo' },
    { pattern: '/users/:userId/friends/:friendId' },
    { pattern: '/users/:userId/friends' },
    { pattern: '/users/:userId' },
    { pattern: '/users' }
  ]
);

/* 
  Returns:
    {
      patternIndex: 3,
      params: {
        userId: '123'
      }
    }
*/
```

#### Example 2

```js
var params = extractParamsInFirstMatch(
  '/users/123/subscriptions',
  [
    { pattern: '/users/:userId/friends/:friendId/photo' },
    { pattern: '/users/:userId/friends/:friendId' },
    { pattern: '/users/:userId/friends' },
    { pattern: '/users/:userId' },
    { pattern: '/users' }
  ]
);

/* 
  Returns:
    null
    
  because none of the patterns match.
*/
```

#### Example 3

```js
function userIdValidator(params) {
  if (!('userId' in params)) {
    return params;
  }

  // Without this check, '/users/1234/friends/567' would match '/users/:userId'
  // with { userId: '1234/friends/567' }
  if (!(/^\d+$/.test(params.userId))) {
    return null;
  }

  var userId = parseInt(params.userId, 10);

  return userId >= 1 && userId <= 999 ? params : null;
}
var params = extractParamsInFirstMatch(
  '/users/1234/friends/567',
  [
    { pattern: '/users/:userId/friends/:friendId/photo', transform: userIdValidator },
    { pattern: '/users/:userId/friends/:friendId', transform: userIdValidator },
    { pattern: '/users/:userId/friends', transform: userIdValidator },
    { pattern: '/users/:userId', transform: userIdValidator },
    { pattern: '/users' }
  ]
);

/* 
  Returns:
    null
    
  because userId > 999
*/
```

<a name="patterns"></a>
## Patterns

The functions in this library operate on a `pattern` type.

### Basic patterns

In its simplest form, pattern is just a string, e.g. `/users`.

Patterns can have parameters, e.g. `/users/:userId/friends/:friendId/photo`.

Parameters must start with a `:`, and can contain letters only. Therefore, `:username`, `:userName`, and `:USERNAME` are valid parameters, but `:user-name`, `:user_name` and `:iphone6` are not.

### Advanced patterns

For more advanced patterns, an object with the following keys can be provided:

* `pattern` - (required) The pattern string.
* `caseSensitive` - (optional) Boolean indicating whether the pattern is considered case sensitive or not. [Example](#case-insensitive-example)<br />Defaults to `true`.
* `transform` - (optional) Function that takes the extracted params, and returns a manipulated version of them. [Example](#lowercase-keys-example)<br />If it returns `null`, the match fails. [Example](#regex-validation-example)<br />Defaults to the identity function.

## Running Tests

```shell
npm test
```

## License

<a href="http://moroshko.mit-license.org" target="_blank">MIT</a>
