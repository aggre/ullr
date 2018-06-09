import { render as _render } from 'lit-html/lib/lit-extended'
import { TemplateResult } from 'lit-html'

export const random = () => btoa(`${Math.random()}`)

export const render = async (
	template: Promise<TemplateResult> | TemplateResult,
	el: HTMLElement
) => _render(await template, el.shadowRoot || el.attachShadow({ mode: 'open' }))

export class UllrElement extends HTMLElement {
	connected: boolean
	connectedCallback() {
		this.connected = true
	}
	disconnectedCallback() {
		this.connected = false
	}
}
