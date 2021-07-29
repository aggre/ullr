import { expect } from '@esm-bundle/chai'
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
		const p = document.body.querySelector('ullr-sbsc > p')!
		expect(removeExtraString(p.innerHTML)).to.be.equal('10')
		expect(count).to.be.equal(10)
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
		const init = document.body.querySelector('p > ullr-sbsc')!
		expect(removeExtraString(init.innerHTML)).to.be.equal('0')
		await sleep(100)
		const p = document.body.querySelector('p > ullr-sbsc')!
		expect(removeExtraString(p.innerHTML)).to.be.equal('10')
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
		expect(
			removeExtraString(document.body.querySelector('p')!.innerHTML)
		).to.be.equal('placeholder')
		await sleep(100)
		const p = document.body.querySelector('ullr-sbsc > p')!
		expect(removeExtraString(p.innerHTML)).to.be.equal('1')
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
			const p = document.body.querySelector('ullr-sbsc > p')!
			expect(removeExtraString(p.innerHTML)).to.be.equal('1')
			expect(count).to.be.equal(1)
			render(html``, document.body)
			await sleep(100)
			expect(count).to.be.equal(1)
		})
	}

	describe('Passing content', () => {
		it('Pass a TemplateResult', () => {
			count.next(1)
			render(
				html` ${subscribe(count, (x) => html` <p>${x}</p> `)} `,
				document.body
			)
			const el = document.body.querySelector('ullr-sbsc > p')!
			expect(removeExtraString(el.innerHTML)).to.be.equal('1')
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
			const el = document.body.querySelector('ullr-sbsc > p')!
			expect(removeExtraString(el.innerHTML)).to.be.equal('number: 2')
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
			const el = (): Element => document.body.querySelector('ullr-sbsc > p')!

			expect(removeExtraString(el().innerHTML)).to.be.equal('')
			await sleep(100)
			expect(removeExtraString(el().innerHTML)).to.be.equal('Done 3')
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
				document.body.querySelector('ullr-sbsc > p > ullr-sbsc')!
			expect(removeExtraString(el().innerHTML)).to.be.equal('4')
			subject.next(1)
			expect(removeExtraString(el().innerHTML)).to.be.equal('5')
			subject.next(2)
			expect(removeExtraString(el().innerHTML)).to.be.equal('6')
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
				? document.body.querySelector('ullr-sbsc > ullr-shdw > p')!
				: (document.body
						.querySelector('ullr-sbsc')!
						.querySelector('ullr-shdw')!
						.shadowRoot!.querySelector('p') as HTMLElement)
			expect(removeExtraString(el.innerHTML)).to.be.equal('5')
		})
	})
})
