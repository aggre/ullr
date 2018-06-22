import { html } from 'lit-html/lib/lit-extended'
import { TemplateResult } from 'lit-html'
import { random, render, UllrElement } from './lib/element'

export type AsyncOrSyncTemplateResult = TemplateResult | Promise<TemplateResult>

const templates: Map<string, AsyncOrSyncTemplateResult> = new Map()

export const component = (template: AsyncOrSyncTemplateResult) => {
	const token = random()
	templates.set(token, template)
	return html`<ullr-shdw t$='${token}'></ullr-shdw>`
}

export const customElements = (
	template: (props: string[]) => AsyncOrSyncTemplateResult,
	observedAttributes: string[] = []
) =>
	class extends UllrElement {
		props: string[]
		constructor() {
			super()
			this.props = []
		}
		static get observedAttributes() {
			return observedAttributes
		}
		attributeChangedCallback(name, _, next) {
			const index = observedAttributes.findIndex(n => n === name)
			this.props[index] = next
			if (this.connected) {
				this._render().catch()
			}
		}
		connectedCallback() {
			super.connectedCallback()
			this._render().catch()
		}
		async _render() {
			render(await template(this.props), this)
		}
	}

window.customElements.define(
	'ullr-shdw',
	class extends UllrElement {
		token: string
		template: AsyncOrSyncTemplateResult | undefined
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
