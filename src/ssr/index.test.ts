import { ssr } from '.'
import { html } from 'lit-html'
import { strictEqual } from 'assert'

describe('SSR', () => {
	it('Rendering a static template', async () => {
		const result = await ssr(html`<div>Test</div>`, () => true)
		strictEqual(result, '<div>Test</div>')
	})

	it('Rendering a async template', async () => {
		const result = await ssr(
			html`<div>${new Promise(resolve => {
				setTimeout(() => resolve('Test'), 500)
			})}</div>`,
			h => h === '<div>Test</div>'
		)
		strictEqual(result, '<div>Test</div>')
	})
})
