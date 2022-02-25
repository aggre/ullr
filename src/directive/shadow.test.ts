import { expect } from '@esm-bundle/chai'
import { html, render, TemplateResult } from 'lit-html'
import { shadow } from '.'
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

describe('shadow directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Render to the ShadowRoot in "ullr-shdw" element', () => {
		const app = (content: string): TemplateResult =>
			html` ${shadow(html` <main>${content}</main> `)} `
		render(app('App'), document.body)
		const main = contentInShadow('main')
		expect(main).to.not.equal(null)
		expect(removeExtraString(main.innerHTML)).to.be.equal('App')
	})

	it('Re-render if the template different from last time', () => {
		const subject = new BehaviorSubject(0)

		render(
			html` ${subscribe(subject, (x) => shadow(html` <main>${x}</main> `))} `,
			document.body
		)
		expect(removeExtraString(contentInShadow('main').innerHTML)).to.be.equal(
			'0'
		)
		subject.next(1)
		expect(removeExtraString(contentInShadow('main').innerHTML)).to.be.equal(
			'1'
		)
		subject.next(2)
		expect(removeExtraString(contentInShadow('main').innerHTML)).to.be.equal(
			'2'
		)
	})

	describe('Passing content', () => {
		it('Pass a TemplateResult', () => {
			render(html` ${shadow(html` <p>Test</p> `)} `, document.body)
			expect(removeExtraString(contentInShadow('p').innerHTML)).to.be.equal(
				'Test'
			)
		})

		it('Pass a TemplateResult containing the shadow directive', () => {
			render(
				html` ${shadow(html` ${shadow(html` <p>Test</p> `)} `)} `,
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
					${shadow(html` ${subscribe(subject, (x) => html` <p>${x}</p> `)} `)}
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
