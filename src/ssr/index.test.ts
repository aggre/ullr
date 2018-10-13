import { ssr } from '.'
import { html } from 'lit-html'

describe('SSR', () => {
	it('SSR', done => {
		const observer = ssr(html`<div>Test</div>`, result => {
			console.log(result)
			observer.disconnect()
			expect(result).to.be.ok()
			done()
		})
	})
})
