import { ssr } from '.'
import { html } from 'lit-html'
import { strictEqual } from 'assert'

describe('SSR', () => {
	it('Rendering a static template', async () => {
		const result = await ssr(html`<div>Test</div>`, () => true)
		strictEqual(result, '<div>Test</div>')
	})
})
