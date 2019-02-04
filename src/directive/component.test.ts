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

	it('Re-render if the template different from last time', () => {
		const app = (main: string, content: string) =>
			html`
				${
					component(
						html`
							<main>${main}</main>
						`
					)
				}
				<p>${content}</p>
			`
		render(app('Prev', 'App'), document.body)
		const shadow = document.body.querySelector('ullr-shdw')
		const prev = (shadow as Element).getAttribute('t')
		render(app('Next', 'App Next'), document.body)
		const next = (shadow as Element).getAttribute('t')
		expect(next).to.not.be(prev)
	})

	it('Not re-render if the same template', () => {
		const app = (main: string, content: string) =>
			html`
				${
					component(
						html`
							<main>${main}</main>
						`
					)
				}
				<p>${content}</p>
			`
		render(app('Immutable', 'App'), document.body)
		const shadow = document.body.querySelector('ullr-shdw')
		const prev = (shadow as Element).getAttribute('t')
		render(app('Immutable', 'App Next'), document.body)
		const next = (shadow as Element).getAttribute('t')
		expect(next).to.be(prev)
	})
})
