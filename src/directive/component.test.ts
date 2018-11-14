import { html, render } from 'lit-html'
import { component } from '.'

describe('component directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Render to the ShadowRoot in "ullr-shdw" element', () => {
		const app = (content: string) =>
			html`
				${
					component(
						html`
							<main>${content}</main>
						`
					)
				}
			`
		render(app('App'), document.body)
		const shadow = document.body.querySelector('ullr-shdw')
		const main = ((shadow as Element).shadowRoot as ShadowRoot).querySelector(
			'main'
		)
		expect(main).to.be.ok()
		expect((main as Element).innerHTML).to.be('<!---->App<!---->')
	})
})
