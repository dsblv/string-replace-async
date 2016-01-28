# string-replace-async [![Build Status](https://travis-ci.org/dsblv/string-replace-async.svg?branch=master)](https://travis-ci.org/dsblv/string-replace-async)

> Asynchronous String.prototype.replace()


## Install

```
$ npm install --save string-replace-async
```


## Usage

```js
const stringReplaceAsync = require('string-replace-async');
const ghUser = require('gh-user');

function replace(match, login) {
	return ghUser(login).then(user => user.name);
}

stringReplaceAsync('Sup, {dsblv}', /{([^}]*)}/g, replacer)
	.then(console.log);
//=> 'Sup, Dimzel Sobolev'
```


## API

The API is basically the same as [String.prototype.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace), except the first argument is a string itself.

### stringReplaceAsync(string, expression, replacer)

#### string

Type: `string`  
*Required*

A string to be processed.

#### expression

Type: `regexp`, `string`  
*Required*

An expression to match substrings to replace.

#### replacer

Type: `fuction`, `string`  
*Required*

A `function` that takes [several arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter) and returns a `promise`. Resolved value will be used as *replacement string*.


## License

MIT © [Dmitriy Sobolev](http://github.com/dsblv)
