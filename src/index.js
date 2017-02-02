import { dirname, resolve } from './utils/path';

let moduleById = {};
moduleById['main.js'] = {code: "import {l} from './module1.js'; l();"};
moduleById['module1.js'] = {code: "import foo from './module2.js'; export function l () { console.log(foo);}"};
moduleById['module2.js'] = {code: 'const foo = 42; export default foo;'};

        rollup.rollup({
			entry: 'main.js',
            plugins: [{
				resolveId ( importee, importer ) {
					if ( !importer ) return importee;
					if ( importee[0] !== '.' ) return false;

					let resolved = resolve( dirname( importer ), importee ).replace( /^\.\//, '' );
					if ( resolved in moduleById ) return resolved;

					resolved += '.js';
					if ( resolved in moduleById ) return resolved;

					throw new Error( `Could not resolve '${importee}' from '${importer}'` );
				},
				load: function ( id ) {
					return moduleById[ id ].code;
				}
            }]
        }).then(bundle => {
            let code = bundle.generate({ format: "cjs"}).code;
            eval(code);
        });