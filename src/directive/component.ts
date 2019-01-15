import { directive, html, TemplateResult, Part } from 'lit-html'
import { random, render, UllrElement } from '../lib/element'

const templates = new Map()

window.customElements.define(
	'ullr-shdw',
	class extends UllrElement {
		token: string
		template: TemplateResult
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

const componentFn = (template: TemplateResult) => {
	const token = random()
	templates.set(token, template)
	return html`
		<ullr-shdw t="${token}"></ullr-shdw>
	`
}

const f = (template: TemplateResult) => (part: Part) => {
	part.setValue(componentFn(template))
}

export const component = directive(f)
