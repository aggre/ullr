import { timer as _timer } from 'rxjs'
import { take, filter } from 'rxjs/operators'
import { subscribe } from './subscribe'
import { html } from '..'
import { render } from 'lit-html'

const sleep = async (time: number) =>
	new Promise(resolve => {
		setTimeout(() => resolve(), time)
	})

const slotSelector = (
	element: Element | null,
	slot: string,
	selector: string
) => {
	if (!element) {
		return
	}
	const { shadowRoot } = element
	const slotEl = (shadowRoot || element).querySelector(slot)
	if (!slotEl) {
		return
	}
	const [assigned] = (slotEl as HTMLSlotElement).assignedNodes()
	const { parentElement } = assigned
	if (!parentElement) {
		return
	}
	return parentElement.querySelector(selector)
}

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
		await sleep(0)
		expect(
			(document.body.querySelector('p') as HTMLParagraphElement).innerText
		).to.be('placeholder')
		await sleep(100)
		const p = slotSelector(
			document.body.querySelector('f-e-subscribe'),
			'slot',
			'p'
		)
		expect((p as HTMLParagraphElement).innerText).to.be('10')
		expect(count).to.be(10)
	})
})
