import { component } from './index'
import { render } from 'lit-html'
import { html } from 'lit-html/lib/lit-extended'

describe('Rendering', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	describe('Rendering html', () => {
		it('Rendering html', () => {
			const template = html`<h1>The title</h1>`
			render(template, document.body)
			const h1 = document.body.querySelector('h1')
			expect(h1).to.be.ok()
			expect((h1 as HTMLHeadingElement).innerText).to.be('The title')
		})
	})

	describe('Rendering component', () => {
		it('Render to the ShadowRoot in "ullr-shdw" element', () => {
			const app = (content: string) => component(html`<main>${content}</main>`)
			render(app('App'), document.body)
			const shadow = document.body.querySelector('ullr-shdw')
			const main = ((shadow as Element).shadowRoot as ShadowRoot).querySelector(
				'main'
			)
			expect(main).to.be.ok()
			expect((main as Element).innerHTML).to.be('<!---->App<!---->')
		})
	})
})
