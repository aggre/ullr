import { component, customElements } from './index'
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

describe('Custom Elements', () => {
	it('Create Custom Elements', () => {
		const template = () => html`<main>App</main>`
		const xApp = customElements(() => template())
		window.customElements.define('x-app', xApp)
		render(html`<x-app></x-app>`, document.body)
		const app = document.body.querySelector('x-app')
		expect(app).to.be.ok()
		expect(((app as Element).shadowRoot as ShadowRoot).innerHTML).to.be(
			'<main>App</main>'
		)
	})
	describe('When the second argument is provided as an array', () => {
		it('Re-render when changing attribute values', () => {
			const template = ([message, description]) =>
				html`<p>${message}</p><p>${description}</p>`
			const xApp = customElements(template, ['message', 'description'])
			const select = (p: string, c: string) =>
				((document.body.querySelector(p) as Element)
					.shadowRoot as ShadowRoot).querySelector(c)
			window.customElements.define('x-app-2', xApp)
			render(html`<x-app-2></x-app-2>`, document.body)
			const app = document.body.querySelector('x-app-2') as Element
			app.setAttribute('message', 'Test message')
			app.setAttribute('description', 'Test description')
			expect((select('x-app-2', 'p') as HTMLParagraphElement).innerText).to.be(
				'Test message'
			)
			expect(
				(select('x-app-2', 'p + p') as HTMLParagraphElement).innerText
			).to.be('Test description')
		})
	})
})
