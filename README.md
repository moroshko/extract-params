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
var extractParams = require('extract-params');
```

## API

### extractParams(str, pattern)

This function extracts `pattern` parameters by matching `str` **at the start** (see examples below).

`pattern` parameters must be in the following format: `:camelCase`

If `str` doesn't match `pattern` at the start, returns `{}`.

Example 1:

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

Example 2:

```js
var params = extractParams(
  '/home/users/123/friends/456/photo',
  '/users/:userId/friends/:friendId/photo'
);

/* 
  Returns:
    {}
      
  because `str` matches `pattern`, but not at the start.
*/
```

## Running Tests

```shell
npm test
```

## License

[MIT](http://moroshko.mit-license.org)
