import { assert } from 'assertthat'
import { html, render, TemplateResult } from 'lit-html'
import { component } from '.'
import { isNodeEnv } from '../lib/is-node-env'
const { document } = window

describe('component directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Render to the ShadowRoot in "ullr-shdw" element', () => {
		const app = (content: string): TemplateResult =>
			html`
				${component(
					html`
						<main>${content}</main>
					`
				)}
			`
		render(app('App'), document.body)
		const main = isNodeEnv()
			? (document.body.querySelector('ullr-shdw > main') as Element)
			: ((document.body.querySelector('ullr-shdw') as Element)
					.shadowRoot as ShadowRoot).querySelector('main')
		assert.that(main).is.not.null()
		assert.that((main as Element).innerHTML).is.equalTo('<!---->App<!---->')
	})

	it('Re-render if the template different from last time', () => {
		const app = (main: string, content: string): TemplateResult =>
			html`
				${component(
					html`
						<main>${main}</main>
					`
				)}
				<p>${content}</p>
			`
		render(app('Prev', 'App'), document.body)
		const shadow = document.body.querySelector('ullr-shdw')
		const prev = (shadow as Element).getAttribute('t')
		render(app('Next', 'App Next'), document.body)
		const next = (shadow as Element).getAttribute('t')
		assert.that(next).is.not.equalTo(prev)
	})

	it('Not re-render if the same template', () => {
		const app = (main: string, content: string): TemplateResult =>
			html`
				${component(
					html`
						<main>${main}</main>
					`
				)}
				<p>${content}</p>
			`
		render(app('Immutable', 'App'), document.body)
		const shadow = document.body.querySelector('ullr-shdw')
		const prev = (shadow as Element).getAttribute('t')
		render(app('Immutable', 'App Next'), document.body)
		const next = (shadow as Element).getAttribute('t')
		assert.that(next).is.equalTo(prev)
	})
})
