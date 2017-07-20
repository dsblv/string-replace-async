import test from 'ava';
import fn from './';

test('reset lastIndex to 0', t => {
	const anchorRegex = /<a[^>]*>([^<]+)<\/a>/gi;

	const x = 'Nunquam perdere <a href="https://a.jpg">https://a.jpg</a> olla <a href="https://b.jpg">https://b.jpg</a>.';
	anchorRegex.test(x);

	const replacer = () => new Promise(resolve => {
		setTimeout(() => resolve('returned'), 10);
	});

	fn(x, anchorRegex, replacer)
		.then(res => {
			t.is(res, 'Nunquam perdere returned olla returned.');
		});
});

test('replace with global flag', t => {
	const string = 'hellololo';

	const replacer = () => new Promise(resolve => {
		setTimeout(() => resolve('la'), 10);
	});

	return fn(string, /lo/g, replacer)
		.then(res => {
			t.is(res, 'hellalala');
		});
});

test('replace without global flag', t => {
	const string = 'hellololo';

	const replacer = () => new Promise(resolve => {
		setTimeout(() => resolve('la'), 10);
	});

	return fn(string, /lo/, replacer)
		.then(res => {
			t.is(res, 'hellalolo');
		});
});

test('macth by a string', t => {
	const string = 'hellololo';

	const replacer = () => new Promise(resolve => {
		setTimeout(() => resolve('la'), 10);
	});

	return fn(string, 'lo', replacer)
		.then(res => {
			t.is(res, 'hellalolo');
		});
});

test('string as a replacer', t => {
	const string = 'hellololo';

	return fn(string, /lo/g, 'la')
		.then(res => {
			t.is(res, 'hellalala');
		});
});

test('sequential replacer invocation', t => {
	const string = 'hellololo';

	const replacer = () => new Promise(resolve => {
		setTimeout(() => resolve('la'), 100);
	});

	const startTime = Date.now();

	return fn.seq(string, /lo/g, replacer)
		.then(res => {
			t.is(res, 'hellalala');
			t.true(Date.now() - startTime > 299);
		});
});

test('reject in a promise', t => fn().catch(() => {
	t.pass();
}));
