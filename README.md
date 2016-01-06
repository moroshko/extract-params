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

* [`extractParams(str, pattern)`](#extractParams)
* [`extractParamsInFirstMatch(str, patterns)`](#extractParamsInFirstMatch)

<a name="extractParams"></a>
### extractParams(str, pattern)

Tests whether `str` matches the given parameterized [pattern](#patterns). If match is successful, it returns a hash of parameters and their values. Otherwise, `extractParams` returns `null`.

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
  {
    pattern: '/users/:userId/friends/:friendId/photo',
    transform: function(params) {
      var userId = parseInt(params.userId, 10);

      return userId >= 1 && userId <= 999 ? params : null;
    }
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

In its simplest form, it is just a string, e.g. `/users/:userId/friends/:friendId/photo`.

### Advanced patterns

For more advanced patterns, an object can be provided instead.

If the path is not case sensitive, you can define the `caseSensitive` option:

```js
{
  pattern: `/users/:userId/friends/:friendId/photo`,
  caseSensitive: false
}
```

An optional `transform` function can be provided to manipulate the extracted params:

For example, you can lowercase the values in `params`:

```js
{
  pattern: '/albums/:albumName',
  transform: function(params) {
    return {
      albumName: params.albumName.toLowerCase()
    };
  }
}
```

If `transform` returns `null`, the match fails.

For example, you can ensure params match a regular expression:

```js
{
  pattern: '/albums/:albumName',
  transform: function(params) {
    return /[a-z0-9\-]/i.test(params.albumName) ? params : null;
  }
}
```

## Running Tests

```shell
npm test
```

## License

[MIT](http://moroshko.mit-license.org)
