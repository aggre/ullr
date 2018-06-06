import { timer as _timer } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { subscribe } from './subscribe'
import { render, html } from '../index'

const sleep = async (time: number) =>
	new Promise(resolve => {
		setTimeout(() => resolve(), time)
	})

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
			await html`${subscribe(
				timer,
				x => {
					count += 1
					return html`<p>${x}</p>`
				},
				html`<p>placeholder</p>`
			)}`,
			document.body
		)
		const getP = () => document.body.querySelector('p') as HTMLParagraphElement
		await sleep(0)
		expect(getP().innerText).to.be('placeholder')
		await sleep(100)
		expect(getP().innerText).to.be('10')
		expect(count).to.be(10)
	})
})
