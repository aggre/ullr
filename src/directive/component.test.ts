import { expect } from '@esm-bundle/chai'
import { html, render, TemplateResult } from 'lit-html'
import { component } from '.'
import { isNodeEnv } from '../lib/is-node-env'
import { removeExtraString } from '../lib/test'
import { BehaviorSubject } from 'rxjs'
import { subscribe } from './subscribe'
const { document } = window

const contentInShadow = (selector: string): Element =>
	isNodeEnv()
		? document.body.querySelector(`ullr-shdw > ${selector}`)!
		: document.body
				.querySelector('ullr-shdw')!
				.shadowRoot!.querySelector(selector)!

describe('component directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Render to the ShadowRoot in "ullr-shdw" element', () => {
		const app = (content: string): TemplateResult =>
			html` ${component(html` <main>${content}</main> `)} `
		render(app('App'), document.body)
		const main = contentInShadow('main')
		expect(main).to.not.equal(null)
		expect(removeExtraString(main.innerHTML)).to.be.equal('App')
	})

	it('Re-render if the template different from last time', () => {
		const app = (main: string, content: string): TemplateResult =>
			html`
				${component(html` <main>${main}</main> `)}
				<p>${content}</p>
			`
		render(app('Prev', 'App'), document.body)
		const shadow = document.body.querySelector('ullr-shdw')
		const prev = shadow!.getAttribute('t')
		render(app('Next', 'App Next'), document.body)
		const next = shadow!.getAttribute('t')
		expect(next).to.not.be.equal(prev)
	})

	it('Not re-render if the same template', () => {
		const app = (main: string, content: string): TemplateResult =>
			html`
				${component(html` <main>${main}</main> `)}
				<p>${content}</p>
			`
		render(app('Immutable', 'App'), document.body)
		const shadow = document.body.querySelector('ullr-shdw')
		const prev = shadow!.getAttribute('t')
		render(app('Immutable', 'App Next'), document.body)
		const next = shadow!.getAttribute('t')
		expect(next).to.be.equal(prev)
	})

	describe('Passing content', () => {
		it('Pass a TemplateResult', () => {
			render(html` ${component(html` <p>Test</p> `)} `, document.body)
			expect(removeExtraString(contentInShadow('p').innerHTML)).to.be.equal(
				'Test'
			)
		})

		it('Pass a TemplateResult containing the component directive', () => {
			render(
				html` ${component(html` ${component(html` <p>Test</p> `)} `)} `,
				document.body
			)
			const el = isNodeEnv()
				? document.body.querySelector('ullr-shdw > ullr-shdw > p')!
				: (document.body
						.querySelector('ullr-shdw')!
						.shadowRoot!.querySelector('ullr-shdw')!
						.shadowRoot!.querySelector('p') as HTMLElement)
			expect(removeExtraString(el.innerHTML)).to.be.equal('Test')
		})

		it('Pass a TemplateResult containing the subscribe directive', () => {
			const subject = new BehaviorSubject(0)

			render(
				html`
					${component(
						html` ${subscribe(subject, (x) => html` <p>${x}</p> `)} `
					)}
				`,
				document.body
			)
			expect(removeExtraString(contentInShadow('p').innerHTML)).to.be.equal('0')
			subject.next(1)
			expect(removeExtraString(contentInShadow('p').innerHTML)).to.be.equal('1')
			subject.next(2)
			expect(removeExtraString(contentInShadow('p').innerHTML)).to.be.equal('2')
		})
	})
})
