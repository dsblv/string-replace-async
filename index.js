'use strict';
const escapeStr = require('escape-string-regexp');

function matchAll(str, re) {
	const matches = [];
	let res = re.exec(str);

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
			const prefix = res.slice(0, match.index);
			const postfix = res.slice(match.index + match[0].length);

			return prefix + match.replacement + postfix;
		}, str);
}

function assignReplacement(match, replacer) {
	const args = match.concat([match.index, match.input]);

	return replacer.apply(null, args)
		.then(replacement => Object.assign({}, match, {replacement}));
}

module.exports = function (str, re, replacer) {
	if (typeof replacer === 'string') {
		return Promise.resolve(str.replace(re, replacer));
	}

	if (typeof re === 'string') {
		re = new RegExp(escapeStr(re));
	}

	const matches = matchAll(str, re);
	const promises = matches.map(match => assignReplacement(match, replacer));

	return Promise.all(promises)
		.then(matches => replaceAll(str, matches));
};
