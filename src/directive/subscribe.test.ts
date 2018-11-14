import { timer as _timer } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { html, render } from 'lit-html'
import { sleep } from '../lib/test'
import { subscribe } from '.'

describe('subscribe directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Subscribe to observable', async () => {
		const timer = _timer(10, 1).pipe(
			filter(x => x > 0),
			take(10)
		)
		let count = 0
		render(
			html`
				${
					subscribe(timer, x => {
						count += 1
						return html`
							<p>${x}</p>
						`
					})
				}
			`,
			document.body
		)
		await sleep(100)
		const p = (document.body.querySelector(
			'ullr-sbsc'
		) as Element).querySelector('p')
		expect((p as HTMLParagraphElement).innerText).to.be('10')
		expect(count).to.be(10)
	})

	it('When the third argument is provided, its value is rendered as initial content', async () => {
		const timer = _timer(10, 1).pipe(
			filter(x => x > 0),
			take(1)
		)
		render(
			html`
				${
					subscribe(
						timer,
						x =>
							html`
								<p>${x}</p>
							`,
						html`
							<p>placeholder</p>
						`
					)
				}
			`,
			document.body
		)
		expect(
			(document.body.querySelector('p') as HTMLParagraphElement).innerText
		).to.be('placeholder')
		await sleep(20)
		const p = (document.body.querySelector(
			'ullr-sbsc'
		) as Element).querySelector('p')
		expect((p as HTMLParagraphElement).innerText).to.be('1')
	})

	it('When removed the node, unsubscribe the subscription', async () => {
		const timer = _timer(0, 10).pipe(
			filter(x => x > 0),
			take(1000)
		)
		let count = 0
		render(
			html`
				${
					subscribe(timer, x => {
						count += 1
						return html`
							<p>${x}</p>
						`
					})
				}
			`,
			document.body
		)
		await sleep(20)
		const p = (document.body.querySelector(
			'ullr-sbsc'
		) as Element).querySelector('p')
		expect((p as HTMLParagraphElement).innerText).to.be('1')
		expect(count).to.be(1)
		render(html``, document.body)
		await sleep(100)
		expect(count).to.be(1)
	})
})
