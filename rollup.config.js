import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from 'rollup-plugin-typescript2';
import css from 'rollup-plugin-css-only';

const isDev = Boolean(process.env.ROLLUP_WATCH);

export default [
    // Browser bundle
    {
        input: 'src/main.ts',
        output: {
            sourcemap: true,
            format: 'iife',
            name: 'app',
            file: 'public/dist/bundle.js'
        },
        plugins: [
			svelte({
				preprocess: sveltePreprocess({ sourceMap: isDev }),
				compilerOptions: {
					// hydratable: true,
					// enable run-time checks when not in production
					dev: isDev
				}
			}),
			css({ output: 'bundle.css' }),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({
				sourceMap: isDev,
				inlineSources: isDev
			}),
			// App.js will be built after bundle.js, so we only need to watch that.
			// By setting a small delay the Node server has a chance to restart before reloading.
			isDev &&
				livereload({
					watch: 'public/dist/bundle.js',
					delay: 1000
				}),
			!isDev && terser()
        ],
		watch: {
			clearScreen: false
		}
    },
    // Server bundle
    {
        input: 'src/App.svelte',
        output: {
            exports: 'default',
            sourcemap: false,
            format: 'cjs',
            name: 'app',
            file: 'public/dist/App.js'
        },
        plugins: [
            svelte({
                compilerOptions: {
                    generate: 'ssr'
                }
            }),
            resolve(),
            commonjs(),
            !isDev && terser()
        ]
    }
];
