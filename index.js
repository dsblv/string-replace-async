'use strict';
var escapeStr = require('escape-string-regexp');
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
	return matches
		.reverse()
		.reduce((res, match) => {
			var prefix = res.slice(0, match.index);
			var postfix = res.slice(match.index + match[0].length);

			return prefix + match.replacement + postfix;
		}, str);
}

function assignReplacement(match, replacer) {
	var args = match.concat([match.index, match.input]);

	return replacer.apply(null, args)
		.then(replacement => objectAssign({}, match, {replacement}));
}

module.exports = function (str, re, replacer) {
	if (typeof replacer === 'string') {
		return Promise.resolve(str.replace(re, replacer));
	}

	if (typeof re === 'string') {
		re = new RegExp(escapeStr(re));
	}

	var matches = matchAll(str, re);
	var promises = matches.map(match => assignReplacement(match, replacer));

	return Promise.all(promises)
		.then(matches => replaceAll(str, matches));
};
