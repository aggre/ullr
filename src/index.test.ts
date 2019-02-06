import { customElements } from './index'
import { html, render, TemplateResult } from 'lit-html'

describe('Rendering', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	describe('Rendering html', () => {
		it('Rendering html', () => {
			const template = html`
				<h1>The title</h1>
			`
			render(template, document.body)
			const h1 = document.body.querySelector('h1')
			expect(h1).to.be.ok()
			expect((h1 as HTMLHeadingElement).innerText).to.be('The title')
		})
	})
})

describe('Custom Elements', () => {
	it('Create Custom Elements', () => {
		const template = (): TemplateResult =>
			html`
				<main>App</main>
			`
		const xApp = customElements(template)
		window.customElements.define('x-app', xApp)
		render(
			html`
				<x-app></x-app>
			`,
			document.body
		)
		const app = document.body.querySelector('x-app')
		expect(app).to.be.ok()
		expect(
			((app as Element).shadowRoot as ShadowRoot).innerHTML.replace(
				/<\!---->|\t|\n/g,
				''
			)
		).to.be('<main>App</main>')
	})
	describe('When the second argument is provided as an array', () => {
		it('Re-render when changing attribute values', () => {
			const template = ([message, description]: string[]): TemplateResult =>
				html`
					<p>${message}</p>
					<p>${description}</p>
				`
			const xApp = customElements(template, ['message', 'description'])
			const select = (p: string, c: string): Element | null =>
				((document.body.querySelector(p) as Element)
					.shadowRoot as ShadowRoot).querySelector(c)
			window.customElements.define('x-app-2', xApp)
			render(
				html`
					<x-app-2></x-app-2>
				`,
				document.body
			)
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
