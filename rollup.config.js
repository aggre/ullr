import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import multiEntry from 'rollup-plugin-multi-entry'

const plugins = [
	typescript(),
	commonjs({
		include: 'node_modules/**'
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
