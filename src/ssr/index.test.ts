import { ssr } from '.'
import { html } from 'lit-html'
import { strictEqual } from 'assert'
import { component } from '../directive'

describe('SSR', () => {
	it('Rendering a static template', async () => {
		const [doc, template] = await ssr(
			html`
				<div>Test</div>
			`,
			() => true
		)
		strictEqual(doc, '<html><head></head><body><div>Test</div></body></html>')
		strictEqual(template, '<div>Test</div>')
	})

	it('Rendering a async template', async () => {
		const [doc, template] = await ssr(
			html`
				<div>
					${
						new Promise(resolve => {
							setTimeout(() => resolve('Test'), 500)
						})
					}
				</div>
			`,
			h =>
				(h.querySelector('div') as HTMLDivElement).innerHTML ===
				'<!---->Test<!---->'
		)
		strictEqual(doc, '<html><head></head><body><div>Test</div></body></html>')
		strictEqual(template, '<div>Test</div>')
	})

	it('Rendering fails with Custom Elements', async () => {
		const [doc, template] = await ssr(
			html`
				<div>
					${
						component(
							html`
								Hi
							`
						)
					}
				</div>
			`,
			h => Boolean(h.querySelector('ullr-shdw'))
		)
		strictEqual(doc, '<html><head></head><body></body></html>')
		strictEqual(template, '')
	})

	it('Using html and target options', async () => {
		const [doc, template] = await ssr(
			html`
				<div>Options Test</div>
			`,
			() => true,
			{
				target: '#testApp',
				html: `
				<!DOCTYPE html><html><head></head><body><div id=testApp></div></body></html>
			`
			}
		)
		strictEqual(
			doc,
			'<!DOCTYPE html><html><head></head><body><div id="testApp"><div>Options Test</div></div></body></html>'
		)
		strictEqual(template, '<div>Options Test</div>')
	})

	it('Catch an invalid target in options', async () => {
		const error = await ssr(
			html`
				<div>Options Test</div>
			`,
			() => true,
			{
				target: '#ERROR',
				html: `
				<!DOCTYPE html><html><head></head><body></body></html>
			`
			}
		).catch(err => err)
		strictEqual(error.message, 'target is not found!')
	})
})
