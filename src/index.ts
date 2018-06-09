import { html as _html } from 'lit-html/lib/lit-extended'
import { TemplateResult } from 'lit-html'
import { render, UllrElement } from './lib/element'

export const html = async (strings: TemplateStringsArray, ...values: any[]) =>
	Promise.resolve(_html(strings, ...values))

export const component = async (
	template: Promise<TemplateResult> | TemplateResult
) => html`<ullr-shdw>${template}</ullr-shdw>`

window.customElements.define(
	'ullr-shdw',
	class extends UllrElement {
		connectedCallback() {
			render(_html`<slot></slot>`, this)
		}
	}
)
