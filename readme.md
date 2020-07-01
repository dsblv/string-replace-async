# string-replace-async

> A vesion of "string".replace() that knows how to wait

## Installation

```
$ npm install string-replace-async
```

## Usage

```js
let replaceAsync = require("string-replace-async");

await replaceAsync("#rebeccapurple", /#(\w+)/g, async (match, name) => {
  let color = await getColorByName(name);
  return "#" + color + " (" + name + ")";
});
```

## The Why

Say you have a task of replacing color names with their respective hex codes.

```js
let spec = "I want background to be #papayawhip and borders #rebeccapurple.";
// make it "I want background to be #FFEFD5 (papayawhip) and borders #663399 (rebeccapurple).";
```

Luckily, strings in JavaScript have this handy `replace` method built in, so you use it.

```js
spec.replace(/#(\w+)/g, (match, name) => {
  let color = getColorByName(name);
  return "#" + color + " (" + name + ")";
});
```

Time passes, a new requirement emerges: now you have to query a database for custom colors. This is an async operation, so naturally you convert `getColorByName` into async function.

Turns out it has a cost: now all the code above should also be async. You try this:

```js
await spec.replace(/#(\w+)/g, async (match, name) => {
  let color = await getColorByName(name);
  return "#" + color + " (" + name + ")";
});
```

Unfortunately, this code doesn't work as you expect. **Built in menthod wasn't designed to work as async function.**

This is where `string-replace-async` comes in:

```js
await replaceAsync(spec, /#(\w+)/g, async (match, name) => {
  let color = await getColorByName(name);
  return "#" + color + " (" + name + ")";
});
```

Yay!

`string-replace-async` is nothing but direct `String.prototype.replace` replacement that awaits your function and returns a Promise for results.

## API

API is
[String.prototype.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace), except the first argument is a string itself.

### replaceAsync(string, searchValue, replace)

Runs `replace` and waits for it to resolve before replacing `searchValue` with results. If `searchValue` is a _global_ RegExp, `replace` will be called concurrently for every match.

#### string

Type: `string`  
_Required_

An input string.

#### searchValue

Type: `regexp`, `string`

An expression to match substrings to replace.

#### replace

Type: `function`, `string`

A `function` that takes [several arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter) and returns a `promise`. Resolved value will be used as _replacement substring_.

## A Note on Concurrency

Previously this module had aditional menhod `seq()` that ran `replace` functions one by one instead of all at once. We decided to remove it to narrow our scope. Here's a snippet that achieves the same effect:

```js
let sequence = Promise.resolve();
let seq = (fn) => (...args) => (sequence = sequence.then(() => fn(...args)));

await replaceAsync(
  "#rebeccapurple, #papayawhip",
  /#(\w+)/g,
  seq(async (match, name) => {
    let color = await getColorByName(name);
    return "#" + color + " (" + name + ")";
  })
);
```

## License

MIT © [Dmitrii Sobolev](http://github.com/dsblv)
