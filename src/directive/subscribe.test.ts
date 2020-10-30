import { assert } from 'assertthat'
import { timer as _timer, BehaviorSubject } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { html, render, directive, Part } from 'lit-html'
import { sleep, removeExtraString } from '../lib/test'
import { subscribe } from '.'
import { isNodeEnv } from '../lib/is-node-env'
import { component } from './component'
const { document } = window

const count = new BehaviorSubject(0)
const dir = directive((x: unknown) => (part: Part) => {
	part.setValue(x)
})

describe('subscribe directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Subscribe to observable', async () => {
		const timer = _timer(10, 1).pipe(
			filter((x) => x > 0),
			take(10)
		)
		let count = 0
		render(
			html`
				${subscribe(timer, (x) => {
					count += 1
					return html` <p>${x}</p> `
				})}
			`,
			document.body
		)
		await sleep(100)
		const p = document.body.querySelector('ullr-sbsc > p') as Element
		assert.that(removeExtraString(p.innerHTML)).is.equalTo('10')
		assert.that(count).is.equalTo(10)
	})

	it('Supports Directive function as a template', async () => {
		const timer = _timer(10, 1).pipe(
			filter((x) => x > 0),
			take(10)
		)
		render(
			html` <p>${subscribe(timer, (x) => dir(x), dir(0))}</p> `,
			document.body
		)
		const init = document.body.querySelector('p > ullr-sbsc') as Element
		assert.that(removeExtraString(init.innerHTML)).is.equalTo('0')
		await sleep(100)
		const p = document.body.querySelector('p > ullr-sbsc') as Element
		assert.that(removeExtraString(p.innerHTML)).is.equalTo('10')
	})

	it('When the third argument is provided, its value is rendered as initial content', async () => {
		const timer = _timer(50, 1).pipe(
			filter((x) => x > 0),
			take(1)
		)
		render(
			html`
				${subscribe(
					timer,
					(x) => html` <p>${x}</p> `,
					html` <p>placeholder</p> `
				)}
			`,
			document.body
		)
		assert
			.that(
				removeExtraString(
					(document.body.querySelector('p') as HTMLParagraphElement).innerHTML
				)
			)
			.is.equalTo('placeholder')
		await sleep(100)
		const p = document.body.querySelector('ullr-sbsc > p') as Element
		assert.that(removeExtraString(p.innerHTML)).is.equalTo('1')
	})

	if (!isNodeEnv()) {
		// This spec is only supported on a browser.
		it('When removed the node, unsubscribe the subscription', async () => {
			const timer = _timer(0, 10).pipe(
				filter((x) => x > 0),
				take(1000)
			)
			let count = 0
			render(
				html`
					${subscribe(timer, (x) => {
						count += 1
						return html` <p>${x}</p> `
					})}
				`,
				document.body
			)
			await sleep(20)
			const p = document.body.querySelector('ullr-sbsc > p') as Element
			assert.that(removeExtraString(p.innerHTML)).is.equalTo('1')
			assert.that(count).is.equalTo(1)
			render(html``, document.body)
			await sleep(100)
			assert.that(count).is.equalTo(1)
		})
	}

	describe('Passing content', () => {
		it('Pass a TemplateResult', () => {
			count.next(1)
			render(
				html` ${subscribe(count, (x) => html` <p>${x}</p> `)} `,
				document.body
			)
			const el = document.body.querySelector('ullr-sbsc > p') as Element
			assert.that(removeExtraString(el.innerHTML)).is.equalTo('1')
		})

		it('Pass a TemplateResult containing a synchronous directive', () => {
			const demo = directive((i: number) => (part: Part) => {
				part.setValue(html` number: ${i} `)
				part.commit()
			})

			count.next(2)
			render(
				html` ${subscribe(count, (x) => html` <p>${demo(x)}</p> `)} `,
				document.body
			)
			const el = document.body.querySelector('ullr-sbsc > p') as Element
			assert.that(removeExtraString(el.innerHTML)).is.equalTo('number: 2')
		})

		it('Pass a TemplateResult containing an asynchronous directive', async () => {
			const timer = directive((i: number) => (part: Part) => {
				setTimeout(() => {
					part.setValue(html` Done ${i} `)
					part.commit()
				}, 100)
			})

			count.next(3)
			render(
				html` ${subscribe(count, (x) => html` <p>${timer(x)}</p> `)} `,
				document.body
			)
			const el = (): Element =>
				document.body.querySelector('ullr-sbsc > p') as Element

			assert.that(removeExtraString(el().innerHTML)).is.equalTo('')
			await sleep(100)
			assert.that(removeExtraString(el().innerHTML)).is.equalTo('Done 3')
		})

		it('Pass a TemplateResult containing the subscribe directive', () => {
			const subject = new BehaviorSubject(0)

			count.next(4)
			render(
				html`
					${subscribe(
						count,
						(x) => html` <p>${subscribe(subject, (y) => html` ${x + y} `)}</p> `
					)}
				`,
				document.body
			)
			const el = (): Element =>
				document.body.querySelector('ullr-sbsc > p > ullr-sbsc') as Element
			assert.that(removeExtraString(el().innerHTML)).is.equalTo('4')
			subject.next(1)
			assert.that(removeExtraString(el().innerHTML)).is.equalTo('5')
			subject.next(2)
			assert.that(removeExtraString(el().innerHTML)).is.equalTo('6')
		})

		it('Pass a TemplateResult containing the component directive', () => {
			count.next(5)
			render(
				html`
					${subscribe(count, (x) => html` ${component(html` <p>${x}</p> `)} `)}
				`,
				document.body
			)
			const el = isNodeEnv()
				? (document.body.querySelector(
						`ullr-sbsc > ullr-shdw > p`
				  ) as HTMLElement)
				: ((((document.body.querySelector(
						'ullr-sbsc'
				  ) as Element).querySelector('ullr-shdw') as HTMLElement)
						.shadowRoot as ShadowRoot).querySelector('p') as HTMLElement)
			assert.that(removeExtraString(el.innerHTML)).is.equalTo('5')
		})
	})
})
