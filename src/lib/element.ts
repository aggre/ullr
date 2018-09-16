import { render as _render, TemplateResult } from 'lit-html'

export const render = (template: TemplateResult, el: HTMLElement) =>
	_render(template, el.shadowRoot || el.attachShadow({ mode: 'open' }))

export class UllrElement extends HTMLElement {
	connected: boolean
	connectedCallback() {
		this.connected = true
	}
	disconnectedCallback() {
		this.connected = false
	}
}
