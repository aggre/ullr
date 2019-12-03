import { assert } from 'assertthat'
import { timer as _timer } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { html, render } from 'lit-html'
import { sleep, removeExtraString } from '../lib/test'
import { subscribe } from '.'
import { isNodeEnv } from '../lib/is-node-env'
const { document } = window

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
				${subscribe(timer, x => {
					count += 1
					return html`
						<p>${x}</p>
					`
				})}
			`,
			document.body
		)
		await sleep(100)
		const p = document.body.querySelector('ullr-sbsc > p') as Element
		assert.that(removeExtraString(p.innerHTML)).is.equalTo('10')
		assert.that(count).is.equalTo(10)
	})

	it('When the third argument is provided, its value is rendered as initial content', async () => {
		const timer = _timer(50, 1).pipe(
			filter(x => x > 0),
			take(1)
		)
		render(
			html`
				${subscribe(
					timer,
					x =>
						html`
							<p>${x}</p>
						`,
					html`
						<p>placeholder</p>
					`
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

	if (isNodeEnv() === false) {
		// This spec is only supported on a browser.
		it('When removed the node, unsubscribe the subscription', async () => {
			const timer = _timer(0, 10).pipe(
				filter(x => x > 0),
				take(1000)
			)
			let count = 0
			render(
				html`
					${subscribe(timer, x => {
						count += 1
						return html`
							<p>${x}</p>
						`
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
})
