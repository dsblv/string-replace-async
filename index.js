'use strict';
var escapeStringRegexp = require('escape-string-regexp');
var objectAssign = require('object-assign');

function matchAll(str, re) {
	var matches = [];
	var res = re.exec(str);

	while (res) {
		matches.push(res);

		if (!re.global) {
			break;
		}

		res = re.exec(str);
	}

	return matches;
}

function replaceAll(str, matches) {
	return matches.reverse().reduce(function (res, match) {
		var prefix = res.slice(0, match.index);
		var postfix = res.slice(match.index + match[0].length);

		return prefix + match.replacement + postfix;
	}, str);
}

function assignReplacement(match, replacer) {
	var args = match.concat([match.index, match.input]);

	return replacer.apply(null, args).then(function (res) {
		return objectAssign({}, match, {replacement: res});
	});
}

function sequence(matches, replacer) {
	var initialResult = Promise.resolve([]);

	return matches.reduce(function (prev, match) {
		return prev.then(function (ret) {
			return assignReplacement(match, replacer).then(function (res) {
				return ret.concat([res]);
			});
		});
	}, initialResult);
}

function concurrency(matches, replacer) {
	var promises = matches.map(function (match) {
		return assignReplacement(match, replacer);
	});

	return Promise.all(promises);
}

function processString(str, re, replacer, seq) {
	if (typeof replacer === 'string') {
		return str.replace(re, replacer);
	}

	if (typeof re === 'string') {
		re = new RegExp(escapeStringRegexp(re));
	}

	var matches = matchAll(str, re);
	var processor = seq ? sequence : concurrency;

	return processor(matches, replacer).then(function (matches) {
		return replaceAll(str, matches);
	});
}

function fn(str, re, replacer, seq) {
	if (re instanceof RegExp) {
		re.lastIndex = 0;
	}
	try {
		return Promise.resolve(processString(str, re, replacer, seq));
	} catch (e) {
		return Promise.reject(e);
	}
}

function stringReplaceAsync(str, re, replacer) {
	return fn(str, re, replacer, false);
}

stringReplaceAsync.seq = function (str, re, replacer) {
	return fn(str, re, replacer, true);
};

module.exports = stringReplaceAsync;
