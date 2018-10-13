import { ssr } from '.'
import { html } from 'lit-html'
import { strictEqual } from 'assert'

describe('SSR', () => {
	it('Rendering a static template', async () => {
		const [doc, template] = await ssr(html`<div>Test</div>`, () => true)
		strictEqual(doc, '<html><head></head><body><div>Test</div></body></html>')
		strictEqual(template, '<div>Test</div>')
	})

	it('Rendering a async template', async () => {
		const [doc, template] = await ssr(
			html`<div>${new Promise(resolve => {
				setTimeout(() => resolve('Test'), 500)
			})}</div>`,
			h =>
				(h.querySelector('div') as HTMLDivElement).innerHTML ===
				'<!---->Test<!---->'
		)
		strictEqual(doc, '<html><head></head><body><div>Test</div></body></html>')
		strictEqual(template, '<div>Test</div>')
	})
})
