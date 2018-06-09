import { html } from 'lit-html/lib/lit-extended'
import { TemplateResult } from 'lit-html'
import { random, render, UllrElement } from './lib/element'

const templates: Map<string, TemplateResult> = new Map()

export const component = (template: TemplateResult) => {
	const token = random()
	templates.set(token, template)
	return html`<ullr-shdw t$='${token}'></ullr-shdw>`
}

window.customElements.define(
	'ullr-shdw',
	class extends UllrElement {
		token: string
		template: TemplateResult | undefined
		static get observedAttributes() {
			return ['t']
		}
		attributeChangedCallback(_, prev, next) {
			this.token = next
			this.template = templates.get(next)
			if (prev) {
				templates.delete(prev)
			}
			if (this.connected) {
				this._render()
			}
		}
		connectedCallback() {
			super.connectedCallback()
			this._render()
		}
		disconnectedCallback() {
			super.disconnectedCallback()
			templates.delete(this.token)
		}
		private _render() {
			if (!this.template) {
				return
			}
			render(this.template, this)
		}
	}
)
