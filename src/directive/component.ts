import { html, NodePart, directive } from 'lit-html'
import { random, render, UllrElement } from '../lib/element'
import { AsyncOrSyncTemplateResult } from '..'

const templates = new Map()

window.customElements.define(
	'ullr-shdw',
	class extends UllrElement {
		token: string
		template: AsyncOrSyncTemplateResult
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
				this._render().catch()
			}
		}
		connectedCallback() {
			super.connectedCallback()
			this._render().catch()
		}
		disconnectedCallback() {
			super.disconnectedCallback()
			templates.delete(this.token)
		}
		private async _render() {
			if (!this.template) {
				return
			}
			render(await this.template, this)
		}
	}
)

export const componentFn = (template: AsyncOrSyncTemplateResult) => {
	const token = random()
	templates.set(token, template)
	return html`<ullr-shdw t='${token}'></ullr-shdw>`
}

export const component = (template: AsyncOrSyncTemplateResult) =>
	directive((part: NodePart) => {
		part.setValue(componentFn(template))
		part.commit()
	})
