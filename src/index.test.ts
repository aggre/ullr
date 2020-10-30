import { assert } from 'assertthat'
import { customElements } from './index'
import { html, render, TemplateResult } from 'lit-html'
import { isNodeEnv } from './lib/is-node-env'
import { removeExtraString } from './lib/test'
const { document } = window

if (!isNodeEnv()) {
	// These specs is only supported on a browser.
	describe('Rendering', () => {
		afterEach(() => {
			render(html``, document.body)
		})

		describe('Rendering html', () => {
			it('Rendering html', () => {
				const template = html` <h1>The title</h1> `
				render(template, document.body)
				const h1 = document.body.querySelector('h1')
				assert.that(h1).is.not.null()
				assert
					.that((h1 as HTMLHeadingElement).innerText)
					.is.equalTo('The title')
			})
		})
	})

	describe('Custom Elements', () => {
		it('Create Custom Elements', () => {
			const template = (): TemplateResult => html` <main>App</main> `
			const xApp = customElements(template)
			window.customElements.define('x-app', xApp)
			render(html` <x-app></x-app> `, document.body)
			const app = document.body.querySelector('x-app')
			assert.that(app).is.not.null()
			assert
				.that(
					removeExtraString(
						((app as Element).shadowRoot as ShadowRoot).innerHTML
					)
				)
				.is.equalTo('<main>App</main>')
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
				render(html` <x-app-2></x-app-2> `, document.body)
				const app = document.body.querySelector('x-app-2') as Element
				app.setAttribute('message', 'Test message')
				app.setAttribute('description', 'Test description')
				assert
					.that((select('x-app-2', 'p') as HTMLParagraphElement).innerText)
					.is.equalTo('Test message')
				assert
					.that((select('x-app-2', 'p + p') as HTMLParagraphElement).innerText)
					.is.equalTo('Test description')
			})
		})
	})
}
