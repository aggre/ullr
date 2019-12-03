import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import multiEntry from 'rollup-plugin-multi-entry'

export const plugins = [
	typescript(),
	commonjs({
		include: 'node_modules/**',
		namedExports: { 'node_modules/lodash/lodash.js': ['isEqual' ] }
	}),
	resolve(),
	multiEntry()
]

export default {
	input: ['src/**/*.test.ts'],
	output: {
		file: 'dist/test.js',
		format: 'umd'
	},
	plugins
}
