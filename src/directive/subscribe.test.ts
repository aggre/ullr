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

// Simple Zustand-like store implementation for testing
const createStore = <T>(initialState: T) => {
	let state = initialState
	const listeners = new Set<(state: T, prevState: T) => void>()

	return {
		getState: () => state,
		setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => {
			const prevState = state
			const nextPartial =
				typeof partial === 'function' ? partial(state) : partial
			state = { ...state, ...nextPartial }
			listeners.forEach((listener) => listener(state, prevState))
		},
		subscribe: (listener: (state: T, prevState: T) => void) => {
			listeners.add(listener)
			return () => listeners.delete(listener)
		},
	}
}

describe('subscribe directive', () => {
	afterEach(() => {
		render(html``, document.body)
	})

	it('Subscribe to observable', async () => {
		const timer = _timer(10, 1).pipe(
			filter((x) => x > 0),
			take(10),
		)
		let _count = 0
		render(
			html`
				${subscribe(timer, (x) => {
					_count += 1
					return html` <p>${x}</p> `
				})}
			`,
			document.body,
		)
		await sleep(100)
		const p = document.body.querySelector('body > p')!
		expect(removeExtraString(p.innerHTML)).to.be.equal('10')
		expect(_count).to.be.equal(10)
	})

	it('When the third argument is provided, its value is rendered as initial content', async () => {
		const timer = _timer(50, 1).pipe(
			filter((x) => x > 0),
			take(1),
		)
		render(
			html`
				${subscribe(
					timer,
					(x) => html` <p>${x}</p> `,
					html` <p>placeholder</p> `,
				)}
			`,
			document.body,
		)
		const el = (): Element => document.body.querySelector('body > p')!
		expect(el().innerHTML).to.be.equal('placeholder')
		await sleep(100)
		expect(removeExtraString(el().innerHTML)).to.be.equal('1')
	})

	it('When removed the node, unsubscribe the subscription', async () => {
		const timer = _timer(0, 10).pipe(
			filter((x) => x > 0),
			take(1000),
		)
		let _count = 0
		render(
			html`
				${subscribe(timer, (x) => {
					_count += 1
					return html` <p>${x}</p> `
				})}
			`,
			document.body,
		)
		await sleep(20)
		const p = document.body.querySelector('p')!
		expect(removeExtraString(p.innerHTML)).to.be.equal('1')
		expect(_count).to.be.equal(1)
		render(html``, document.body)
		await sleep(100)
		expect(_count).to.be.equal(1)
	})

	it('When changed the observable, unsubscribe the old subscription', async () => {
		const o1 = new BehaviorSubject(0)
		const o2 = new BehaviorSubject('x')
		const ob = new BehaviorSubject<BehaviorSubject<number | string>>(o1)
		let _x = 0
		render(
			html`
				${subscribe(ob, (x) =>
					subscribe(x, (value) => {
						if (typeof value === 'number') {
							_x = value
						}

						return html` <p>${value}</p> `
					}),
				)}
			`,
			document.body,
		)
		o1.next(123)
		const p1 = document.body.querySelector('p')!
		expect(removeExtraString(p1.innerHTML)).to.be.equal('123')
		expect(_x).to.be.equal(123)

		// Change the observable
		ob.next(o2)

		o2.next('y')
		o1.next(456)
		const p2 = document.body.querySelector('p')!
		expect(removeExtraString(p2.innerHTML)).to.be.equal('y')

		// The old subscription is unsubscribed
		expect(_x).to.be.equal(123)
	})

	describe('Passing content', () => {
		it('Pass a TemplateResult', () => {
			count.next(1)
			render(
				html` ${subscribe(count, (x) => html` <p>${x}</p> `)} `,
				document.body,
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
						(x) => html`
							<p>${subscribe(subject, (y) => html`<span> ${x + y} </span>`)}</p>
						`,
					)}
				`,
				document.body,
			)
			const el = (): Element => document.body.querySelector('p > span')!
			expect(removeExtraString(el().innerHTML)).to.be.equal('4')
			subject.next(1)
			expect(removeExtraString(el().innerHTML)).to.be.equal('5')
			subject.next(2)
			expect(removeExtraString(el().innerHTML)).to.be.equal('6')
		})

		it('Pass a TemplateResult containing nested observable subscriptions', () => {
			const outerSubject = new BehaviorSubject(2)
			const innerSubject = new BehaviorSubject(5)

			render(
				html`
					${subscribe(
						outerSubject,
						(multiplier) => html`
							<div>
								${subscribe(
									innerSubject,
									(value) => html`<span>${multiplier * value}</span>`,
								)}
							</div>
						`,
					)}
				`,
				document.body,
			)

			const el = (): Element => document.body.querySelector('span')!
			expect(removeExtraString(el().innerHTML)).to.be.equal('10')

			innerSubject.next(10)
			expect(removeExtraString(el().innerHTML)).to.be.equal('20')

			// When outer observable emits, inner subscribe re-renders with current inner value
			outerSubject.next(3)
			// 3 * 10 = 30
			expect(removeExtraString(el().innerHTML)).to.be.equal('30')

			// Verify inner observable still updates correctly
			innerSubject.next(4)
			// 3 * 4 = 12
			expect(removeExtraString(el().innerHTML)).to.be.equal('12')
		})

		it('Pass a TemplateResult containing the component directive', () => {
			count.next(5)
			render(
				html`
					${subscribe(count, (x) => html` ${shadow(html` <p>${x}</p> `)} `)}
				`,
				document.body,
			)
			const el = isNodeEnv()
				? document.body.querySelector('ullr-shdw > p')!
				: (document.body
						.querySelector('ullr-shdw')!
						.shadowRoot!.querySelector('p') as HTMLElement)
			expect(removeExtraString(el.innerHTML)).to.be.equal('5')
		})
	})

	describe('Zustand-like store support', () => {
		it('Subscribe to store and render initial state', () => {
			const store = createStore({ count: 42 })
			render(
				html` ${subscribe(store, (state) => html` <p>${state.count}</p> `)} `,
				document.body,
			)
			const p = document.body.querySelector('p')!
			expect(removeExtraString(p.innerHTML)).to.be.equal('42')
		})

		it('Update template when store state changes', () => {
			const store = createStore({ count: 0 })
			render(
				html` ${subscribe(store, (state) => html` <p>${state.count}</p> `)} `,
				document.body,
			)
			const el = (): Element => document.body.querySelector('p')!
			expect(removeExtraString(el().innerHTML)).to.be.equal('0')

			store.setState({ count: 1 })
			expect(removeExtraString(el().innerHTML)).to.be.equal('1')

			store.setState({ count: 100 })
			expect(removeExtraString(el().innerHTML)).to.be.equal('100')
		})

		it('When removed the node, unsubscribe from store', () => {
			const store = createStore({ count: 0 })
			let renderCount = 0
			render(
				html`
					${subscribe(store, (state) => {
						renderCount += 1
						return html` <p>${state.count}</p> `
					})}
				`,
				document.body,
			)
			expect(renderCount).to.be.equal(1)

			store.setState({ count: 1 })
			expect(renderCount).to.be.equal(2)

			// Remove the node
			render(html``, document.body)

			// State changes should not trigger template update
			store.setState({ count: 2 })
			store.setState({ count: 3 })
			expect(renderCount).to.be.equal(2)
		})

		it('When changed the store, unsubscribe the old subscription', () => {
			const store1 = createStore({ value: 'store1' })
			const store2 = createStore({ value: 'store2' })

			let lastValue = ''
			const template = (state: { value: string }) => {
				lastValue = state.value
				return html` <p>${state.value}</p> `
			}

			render(html` ${subscribe(store1, template)} `, document.body)
			expect(lastValue).to.be.equal('store1')

			store1.setState({ value: 'updated1' })
			expect(lastValue).to.be.equal('updated1')

			// Switch to store2
			render(html` ${subscribe(store2, template)} `, document.body)
			expect(lastValue).to.be.equal('store2')

			// Old store updates should not trigger template update
			store1.setState({ value: 'ignored' })
			expect(lastValue).to.be.equal('store2')

			// New store updates should work
			store2.setState({ value: 'updated2' })
			expect(lastValue).to.be.equal('updated2')
		})

		it('Pass a TemplateResult containing nested store subscriptions', () => {
			const outerStore = createStore({ multiplier: 2 })
			const innerStore = createStore({ value: 5 })

			render(
				html`
					${subscribe(
						outerStore,
						(outer) => html`
							<div>
								${subscribe(
									innerStore,
									(inner) =>
										html`<span>${outer.multiplier * inner.value}</span>`,
								)}
							</div>
						`,
					)}
				`,
				document.body,
			)

			const el = (): Element => document.body.querySelector('span')!
			expect(removeExtraString(el().innerHTML)).to.be.equal('10')

			innerStore.setState({ value: 10 })
			expect(removeExtraString(el().innerHTML)).to.be.equal('20')

			// When outer store changes, inner subscribe re-renders with current inner state
			outerStore.setState({ multiplier: 3 })
			// 3 * 10 = 30
			expect(removeExtraString(el().innerHTML)).to.be.equal('30')

			// Verify inner store still updates correctly
			innerStore.setState({ value: 4 })
			// 3 * 4 = 12
			expect(removeExtraString(el().innerHTML)).to.be.equal('12')
		})

		it('Mix Observable and store subscriptions', () => {
			const observable = new BehaviorSubject(10)
			const store = createStore({ multiplier: 2 })

			render(
				html`
					${subscribe(
						observable,
						(value) => html`
							<div>
								${subscribe(
									store,
									(state) => html`<span>${value * state.multiplier}</span>`,
								)}
							</div>
						`,
					)}
				`,
				document.body,
			)

			const el = (): Element => document.body.querySelector('span')!
			expect(removeExtraString(el().innerHTML)).to.be.equal('20')

			store.setState({ multiplier: 3 })
			expect(removeExtraString(el().innerHTML)).to.be.equal('30')

			observable.next(5)
			expect(removeExtraString(el().innerHTML)).to.be.equal('15')
		})
	})
})
