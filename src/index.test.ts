import { html, render, component } from './index'

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
	if (!shadowRoot) {
		return
	}
	const slotEl = shadowRoot.querySelector(slot)
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

describe('Rendering', () => {
	afterEach(async () => {
		render(await html``, document.body)
	})

	it('Rendering html', async () => {
		const template = html`<h1>The title</h1>`
		render(await template, document.body)
		const h1 = document.body.querySelector('h1')
		expect(h1).to.be.ok()
		expect((h1 as HTMLHeadingElement).innerText).to.be('The title')
	})

	describe('Rendering component', () => {
		it('Render to the slot in "f-e-shadow" element', async () => {
			const app = (content: string) => component(html`<main>${content}</main>`)
			render(await app('App'), document.body)
			const shadow = document.body.querySelector('f-e-shadow')
			await sleep(0)
			const main = slotSelector(shadow, 'slot', 'main')
			expect(main).to.be.ok()
			expect((main as Element).innerHTML).to.be('<!---->App<!---->')
		})
	})
})
