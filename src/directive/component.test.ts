import { html, render } from 'lit-html'
import { sleep } from '../lib/test'
import { component } from '.'

describe('component directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Render to the ShadowRoot in "ullr-shdw" element', async () => {
		const app = (content: string) =>
			html`${component(html`<main>${content}</main>`)}`
		render(app('App'), document.body)
		await sleep(0)
		const shadow = document.body.querySelector('ullr-shdw')
		const main = ((shadow as Element).shadowRoot as ShadowRoot).querySelector(
			'main'
		)
		expect(main).to.be.ok()
		expect((main as Element).innerHTML).to.be('<!---->App<!---->')
	})
})
