# string-replace-async

> A vesion of "string".replace() that knows how to wait

## Installation

```
$ npm install string-replace-async
```

## Usage

```js
let replaceAsync = require("string-replace-async");

let message = await replaceAsync(
  `Follow me on twitter maybe: @hypercrabs`,
  /@(\w+)/g,
  async (match, handle) => {
    let { name } = await fetchUserDataFromTwitter(handle);
    return `<a href="https://twitter.com/${handle}">${name}</a>`;
  }
);

// 'Follow me on twitter maybe: <a href="https://twitter.com/hypercrabs">Dima Sobolev</a>'
```

## API

API is basically
[String.prototype.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace), except the first argument is a string itself.

### replaceAsync(string, searchValue, replaceValue)

Runs `replaceValue` and waits for it to resolve before replacing `searchValue`
with results. If `searchValue` is a _global_ RegExp, `replaceValue` will be
called concurrently for every match.

#### string

Type: `string`  
_Required_

A string to be processed.

#### searchValue

Type: `regexp`, `string`

An expression to match substrings to replace.

#### replaceValue

Type: `function`, `string`

A `function` that takes [several arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter) and returns a `promise`. Resolved value will be used as _replacement string_.

## License

MIT © [Dmitrii Sobolev](http://github.com/dsblv)
