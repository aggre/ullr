import { expect } from '@esm-bundle/chai'
import { timer as _timer, BehaviorSubject } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { html, render } from 'lit-html'
import { sleep, removeExtraString } from '../lib/test'
import { subscribe } from '.'
import { isNodeEnv } from '../lib/is-node-env'
import { shadow } from './shadow'
const { document } = window

const count = new BehaviorSubject(0)

describe('subscribe directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Subscribe to observable', async () => {
		const timer = _timer(10, 1).pipe(
			filter((x) => x > 0),
			take(10)
		)
		let _count = 0
		render(
			html`
				${subscribe(timer, (x) => {
					_count += 1
					return html` <p>${x}</p> `
				})}
			`,
			document.body
		)
		await sleep(100)
		const p = document.body.querySelector('body > p')!
		expect(removeExtraString(p.innerHTML)).to.be.equal('10')
		expect(_count).to.be.equal(10)
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
		const el = (): Element => document.body.querySelector('body > p')!
		expect(el().innerHTML).to.be.equal('placeholder')
		await sleep(100)
		expect(removeExtraString(el().innerHTML)).to.be.equal('1')
	})

	it('When removed the node, unsubscribe the subscription', async () => {
		const timer = _timer(0, 10).pipe(
			filter((x) => x > 0),
			take(1000)
		)
		let _count = 0
		render(
			html`
				${subscribe(timer, (x) => {
					_count += 1
					return html` <p>${x}</p> `
				})}
			`,
			document.body
		)
		await sleep(20)
		const p = document.body.querySelector('p')!
		expect(removeExtraString(p.innerHTML)).to.be.equal('1')
		expect(_count).to.be.equal(1)
		render(html``, document.body)
		await sleep(100)
		expect(_count).to.be.equal(1)
	})

	describe('Passing content', () => {
		it('Pass a TemplateResult', () => {
			count.next(1)
			render(
				html` ${subscribe(count, (x) => html` <p>${x}</p> `)} `,
				document.body
			)
			const el = document.body.querySelector('p')!
			expect(removeExtraString(el.innerHTML)).to.be.equal('1')
		})

		it('Pass a TemplateResult containing the subscribe directive', async () => {
			const subject = new BehaviorSubject(0)

			count.next(4)
			render(
				html`
					${subscribe(
						count,
						(x) =>
							html`
								<p>
									${subscribe(subject, (y) => html`<span> ${x + y} </span>`)}
								</p>
							`
					)}
				`,
				document.body
			)
			const el = (): Element => document.body.querySelector('p > span')!
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
					${subscribe(count, (x) => html` ${shadow(html` <p>${x}</p> `)} `)}
				`,
				document.body
			)
			const el = isNodeEnv()
				? document.body.querySelector('ullr-shdw > p')!
				: (document.body
						.querySelector('ullr-shdw')!
						.shadowRoot!.querySelector('p') as HTMLElement)
			expect(removeExtraString(el.innerHTML)).to.be.equal('5')
		})
	})
})
