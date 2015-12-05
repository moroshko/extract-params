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

Tests whether `str` matches the given parameterized `pattern`, and returns a key-value object of parameters and their values in case of a successful match.

`pattern` parameters must be in the following format: `:camelCase`

Match must occur from the first character of `str` in order to be considered successful (see examples below).

If match is not successful, `extractParams` returns `null`.

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
  '/home/users/123/friends/456/photo',
  '/users/:userId/friends/:friendId/photo'
);

/* 
  Returns:
    null
      
  because `str` matches `pattern`,
  but not from the first character of `str`.
*/
```

<a name="extractParamsInFirstMatch"></a>
### extractParamsInFirstMatch(str, patterns)

Tests whether `str` matches one of the parameterized `patterns`. If none of the `patterns` match, `extractParamsInFirstMatch` returns `null`. Otherwise, it returns the matching pattern and its parameters.

#### Example 1

```js
var params = extractParamsInFirstMatch(
  '/users/123',
  [
    '/users/:userId/friends/:friendId/photo',
    '/users/:userId/friends/:friendId',
    '/users/:userId/friends',
    '/users/:userId',
    '/users'
  ]
);

/* 
  Returns:
    {
      pattern: '/users/:userId',
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
    '/users/:userId/friends/:friendId/photo',
    '/users/:userId/friends/:friendId',
    '/users/:userId/friends',
    '/users/:userId',
    '/users'
  ]
);

/* 
  Returns:
    null
    
  because none of the patterns match.
*/
```


## Running Tests

```shell
npm test
```

## License

[MIT](http://moroshko.mit-license.org)
