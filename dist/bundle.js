(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

// TODO does this all work on windows?

var absolutePath = /^(?:\/|(?:[A-Za-z]:)?[\\|\/])/;


function isAbsolute(path) {
	return absolutePath.test(path);
}





function dirname(path) {
	var match = /(\/|\\)[^\/\\]*$/.exec(path);
	if (!match) return '.';

	var dir = path.slice(0, -match[0].length);

	// If `dir` is the empty string, we're at root.
	return dir ? dir : '/';
}





function resolve() {
	for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
		paths[_key] = arguments[_key];
	}

	var resolvedParts = paths.shift().split(/[\/\\]/);

	paths.forEach(function (path) {
		if (isAbsolute(path)) {
			resolvedParts = path.split(/[\/\\]/);
		} else {
			var parts = path.split(/[\/\\]/);

			while (parts[0] === '.' || parts[0] === '..') {
				var part = parts.shift();
				if (part === '..') {
					resolvedParts.pop();
				}
			}

			resolvedParts.push.apply(resolvedParts, parts);
		}
	});

	return resolvedParts.join('/'); // TODO windows...
}

var moduleById = {};
moduleById['main.js'] = { code: "import {l} from './module1.js'; l();" };
moduleById['module1.js'] = { code: "import foo from './module2.js'; export function l () { console.log(foo);}" };
moduleById['module2.js'] = { code: 'const foo = 42; export default foo;' };

rollup.rollup({
	entry: 'main.js',
	plugins: [{
		resolveId: function resolveId(importee, importer) {
			if (!importer) return importee;
			if (importee[0] !== '.') return false;

			var resolved = resolve(dirname(importer), importee).replace(/^\.\//, '');
			if (resolved in moduleById) return resolved;

			resolved += '.js';
			if (resolved in moduleById) return resolved;

			throw new Error('Could not resolve \'' + importee + '\' from \'' + importer + '\'');
		},

		load: function load(id) {
			return moduleById[id].code;
		}
	}]
}).then(function (bundle) {
	var code = bundle.generate({ format: "cjs" }).code;
	eval(code);
});

})));
