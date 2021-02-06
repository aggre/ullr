import { assert } from 'assertthat'
import { html, render, TemplateResult, Part, directive } from 'lit-html'
import { component } from '.'
import { isNodeEnv } from '../lib/is-node-env'
import { removeExtraString, sleep } from '../lib/test'
import { BehaviorSubject } from 'rxjs'
import { subscribe } from './subscribe'
const { document } = window

const contentInShadow = (selector: string): HTMLElement =>
	isNodeEnv()
		? document.body.querySelector(`ullr-shdw > ${selector}`)!
		: document.body
				.querySelector('ullr-shdw')!
				.shadowRoot!.querySelector(selector)!

const dir = directive((x: unknown) => (part: Part) => {
	part.setValue(x)
})

describe('component directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Render to the ShadowRoot in "ullr-shdw" element', () => {
		const app = (content: string): TemplateResult =>
			html` ${component(html` <main>${content}</main> `)} `
		render(app('App'), document.body)
		const main = contentInShadow('main')
		assert.that(main).is.not.null()
		assert
			.that(removeExtraString((main as Element).innerHTML))
			.is.equalTo('App')
	})

	it('Supports Directive function as a template', () => {
		const app = (content: string): TemplateResult =>
			html` ${component(dir(html` <main>${content}</main> `))} `
		render(app('App'), document.body)
		const main = contentInShadow('main')
		assert.that(main).is.not.null()
		assert
			.that(removeExtraString((main as Element).innerHTML))
			.is.equalTo('App')
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
		assert.that(next).is.not.equalTo(prev)
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
		assert.that(next).is.equalTo(prev)
	})

	describe('Passing content', () => {
		it('Pass a TemplateResult', () => {
			render(html` ${component(html` <p>Test</p> `)} `, document.body)
			assert
				.that(removeExtraString(contentInShadow('p').innerHTML))
				.is.equalTo('Test')
		})

		it('Pass a TemplateResult containing a synchronous directive', () => {
			const demo = directive((i: number) => (part: Part) => {
				part.setValue(html` number: ${i} `)
				part.commit()
			})

			render(html` ${component(html` <p>${demo(1)}</p> `)} `, document.body)
			assert
				.that(removeExtraString(contentInShadow('p').innerHTML))
				.is.equalTo('number: 1')
		})

		it('Pass a TemplateResult containing an asynchronous directive', async () => {
			const timer = directive(() => (part: Part) => {
				setTimeout(() => {
					part.setValue(html` Done `)
					part.commit()
				}, 100)
			})

			render(html` ${component(html` <p>${timer()}</p> `)} `, document.body)
			assert
				.that(removeExtraString(contentInShadow('p').innerHTML))
				.is.equalTo('')
			await sleep(100)
			assert
				.that(removeExtraString(contentInShadow('p').innerHTML))
				.is.equalTo('Done')
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
			assert.that(removeExtraString(el.innerHTML)).is.equalTo('Test')
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
			assert
				.that(removeExtraString(contentInShadow('ullr-sbsc > p').innerHTML))
				.is.equalTo('0')
			subject.next(1)
			assert
				.that(removeExtraString(contentInShadow('ullr-sbsc > p').innerHTML))
				.is.equalTo('1')
			subject.next(2)
			assert
				.that(removeExtraString(contentInShadow('ullr-sbsc > p').innerHTML))
				.is.equalTo('2')
		})
	})
})
