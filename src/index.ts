import { html as _html, render as _render, TemplateResult } from 'lit-html'

export const html = async (strings: TemplateStringsArray, ...values: any[]) =>
	Promise.resolve(_html(strings, ...values))

export const render = _render

export const component = async (
	template: Promise<TemplateResult> | TemplateResult
) => html`<f-e-shadow>${template}</f-e-shadow>`

window.customElements.define(
	'f-e-shadow',
	class extends HTMLElement {
		connectedCallback() {
			_render(
				_html`<slot></slot>`,
				this.shadowRoot || this.attachShadow({ mode: 'open' })
			)
		}
	}
)
