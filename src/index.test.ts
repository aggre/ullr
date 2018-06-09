import { html, component } from './index'
import { render } from 'lit-html'
import { sleep } from './lib/test'

describe('Rendering', () => {
	afterEach(async () => {
		render(await html``, document.body)
	})

	describe('Rendering html', () => {
		it('Rendering html', async () => {
			const template = html`<h1>The title</h1>`
			render(await template, document.body)
			const h1 = document.body.querySelector('h1')
			expect(h1).to.be.ok()
			expect((h1 as HTMLHeadingElement).innerText).to.be('The title')
		})

		it('Nested templates are asynchronous rendering', async () => {
			const h1 = html`<h1>The title</h1>`
			const main = html`<main>${h1}</main>`
			const getH1 = (el: HTMLElement) => el.querySelector('h1')
			let h1El
			render(await main, document.body)
			const mainEl = document.body.querySelector('main')
			expect(getH1(mainEl as HTMLElement) as HTMLHeadingElement).to.be(null)
			await sleep(0)
			h1El = getH1(mainEl as HTMLElement) as HTMLHeadingElement
			expect(h1El).to.be.ok()
			expect(h1El.innerText).to.be('The title')
		})
	})

	describe('Rendering component', () => {
		it('Render to the ShadowRoot in "f-e-shadow" element', async () => {
			const app = async (content: string) =>
				component(html`<main>${content}</main>`)
			render(await app('App'), document.body)
			const shadow = document.body.querySelector('f-e-shadow')
			await sleep(0)
			const main = ((shadow as Element).shadowRoot as ShadowRoot).querySelector(
				'main'
			)
			expect(main).to.be.ok()
			expect((main as Element).innerHTML).to.be('<!---->App<!---->')
		})
	})
})
