import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import multiEntry from '@rollup/plugin-multi-entry'
import dts from 'rollup-plugin-dts'

export default [
	{
		input: ['src/**/*.test.ts'],
		output: {
			file: 'dist/test.js',
			format: 'umd'
		},
		plugins: [
			typescript(),
			commonjs({
				include: 'node_modules/**'
			}),
			resolve(),
			multiEntry()
		]
	},
	{
		input: ['src/**/*.ts', '!**/*.test.ts'],
		output: [
			{
				file: 'dist/index.mjs',
				format: 'es',
			},
			{
				file: 'dist/index.js',
				format: 'cjs',
			},
		],
		plugins: [multiEntry(), typescript()],
	},
	{
		input: ['dist/**/*.d.ts', '!**/*.test.d.ts', '!**/d/*'],
		output: [{ file: 'dist/ullr.d.ts', format: 'es' }],
		plugins: [multiEntry(), dts()],
	},
]
