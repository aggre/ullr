import { puppeteerLauncher } from '@web/test-runner-puppeteer'

export default {
	files: 'dist/test.js',
	nodeResolve: true,
	browsers: [
		puppeteerLauncher({
			launchOptions: {
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			},
		}),
	],
}
