<a href="https://codeship.com/projects/119982" target="_blank">
  <img src="https://img.shields.io/codeship/ff47ba10-7c98-0133-b9e7-2e6bcf2dba9a/master.svg"
       alt="Build Status" />
</a>
<a href="https://npmjs.org/package/extract-params" target="_blank">
  <img src="https://img.shields.io/npm/v/extract-params.svg"
       alt="NPM Version" />
</a>
<a href="https://npmjs.org/package/extract-params" target="_blank">
  <img src="https://img.shields.io/npm/dm/extract-params.svg"
       alt="NPM Downloads" />
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

* [`extractParams(str, pattern, [transform])`](#extractParams)
* [`extractParamsInFirstMatch(str, patterns)`](#extractParamsInFirstMatch)

<a name="extractParams"></a>
### extractParams(str, pattern, [transform])

Tests whether `str` matches the given parameterized `pattern`. If match is successful, it returns a hash of parameters and their values.

Otherwise, `extractParams` returns `null`.

An optional `transform` function can be passed to manipulate the extracted params. If `transform` returns `null`, the match fails. `transform` can be used, for example, to lowercase the values in `params`, or to validate them (return `null` if validation fails).

The match is considered successful only if `str` matches the `pattern` at the start and at the end (see examples 2 and 3 below).

`pattern` parameters must have letters only.

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
  '/users/1234/friends/456/photo',
  '/users/:userId/friends/:friendId/photo',
  function(params) {
    var userId = parseInt(params.userId, 10);
    
    return userId >= 1 && userId <= 999 ? params : null;
  }
);

/* 
  Returns:
    null
    
  because userId > 999
*/
```

<a name="extractParamsInFirstMatch"></a>
### extractParamsInFirstMatch(str, patterns)

Tests whether `str` matches one of the parameterized `patterns`. Every pattern can have an optional `transform` function. If none of the `patterns` match, `extractParamsInFirstMatch` returns `null`. Otherwise, it returns the matching pattern index and its parameters.

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

## Running Tests

```shell
npm test
```

## License

[MIT](http://moroshko.mit-license.org)
