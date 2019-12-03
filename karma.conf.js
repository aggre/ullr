process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['mocha'],
		plugins: ['karma-mocha', 'karma-mocha-reporter', 'karma-chrome-launcher'],
		files: ['dist/test.js'],
		reporters: ['mocha'],
		singleRun: true,
		customLaunchers: {
			ChromiumHeadlessConfigured: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox', '--disable-setuid-sandbox']
			}
		},
		browsers: ['ChromiumHeadlessConfigured'],
		browserConsoleLogOptions: {
			level: 'log',
			terminal: true
		}
	})
}
