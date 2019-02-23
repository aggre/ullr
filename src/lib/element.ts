import { render as _render, TemplateResult } from 'lit-html'

export const random = (): string => `${Math.random()}`.slice(2)

export const render = (template: TemplateResult, el: HTMLElement): void => {
	_render(template, el.shadowRoot || el.attachShadow({ mode: 'open' }))
}

export class UllrElement extends HTMLElement {
	connected: boolean
	static get is(): string {
		return ''
	}
	connectedCallback(): void {
		this.connected = true
	}
	disconnectedCallback(): void {
		this.connected = false
	}
}
