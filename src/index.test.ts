import { html, render } from './index'

describe('Rendering', () => {
	it('Rendering html', async () => {
		const template = html`<h1>The title</h1>`
		render(await template, document.body)
		const h1 = document.body.querySelector('h1')
		expect(h1).to.be.ok()
		expect((h1 as HTMLHeadingElement).innerText).to.be('The title')
	})

	after(async () => {
		render(await html``, document.body)
	})
})
