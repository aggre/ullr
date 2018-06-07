import { timer as _timer } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { subscribe } from './subscribe'
import { html } from '..'
import { render } from 'lit-html'
import { sleep, slotSelector } from '../lib/test'

describe('subscribe directive', () => {
	afterEach(async () => {
		render(await html``, document.body)
	})

	it('Subscribe to observable', async () => {
		const timer = _timer(10, 1).pipe(
			filter(x => x > 0),
			take(10)
		)
		let count = 0
		render(
			await html`${subscribe(timer, x => {
				count += 1
				return html`<p>${x}</p>`
			})}`,
			document.body
		)
		await sleep(100)
		const p = slotSelector(
			document.body.querySelector('f-e-subscribe'),
			'slot',
			'p'
		)
		expect((p as HTMLParagraphElement).innerText).to.be('10')
		expect(count).to.be(10)
	})

	it('When the third argument is provided, its value is rendered as initial content', async () => {
		const timer = _timer(10, 1).pipe(
			filter(x => x > 0),
			take(1)
		)
		render(
			await html`${subscribe(
				timer,
				x => html`<p>${x}</p>`,
				html`<p>placeholder</p>`
			)}`,
			document.body
		)
		await sleep(0)
		expect(
			(document.body.querySelector('p') as HTMLParagraphElement).innerText
		).to.be('placeholder')
		await sleep(11)
		const p = slotSelector(
			document.body.querySelector('f-e-subscribe'),
			'slot',
			'p'
		)
		expect((p as HTMLParagraphElement).innerText).to.be('1')
	})

	it('When removed the node, unsubscribe the subscription', async () => {
		const timer = _timer(0, 10).pipe(
			filter(x => x > 0),
			take(1000)
		)
		let count = 0
		render(
			await html`${subscribe(timer, x => {
				count += 1
				return html`<p>${x}</p>`
			})}`,
			document.body
		)
		await sleep(15)
		const p = slotSelector(
			document.body.querySelector('f-e-subscribe'),
			'slot',
			'p'
		)
		expect((p as HTMLParagraphElement).innerText).to.be('1')
		expect(count).to.be(1)
		render(await html``, document.body)
		await sleep(100)
		expect(count).to.be(1)
	})
})
