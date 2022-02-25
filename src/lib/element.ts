import { render as _render, TemplateResult } from 'lit-html'

export const render = (template: TemplateResult, el: HTMLElement): void => {
	_render(
		template,
		(() => {
			if (el.shadowRoot === undefined || el.shadowRoot === null) {
				return el.attachShadow({ mode: 'open' })
			}

			return el.shadowRoot
		})()
	)
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
