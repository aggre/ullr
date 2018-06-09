import { html as _html } from 'lit-html/lib/lit-extended'
import { TemplateResult } from 'lit-html'
import { random, render, UllrElement } from './lib/element'

const templates: Map<
	string,
	Promise<TemplateResult> | TemplateResult
> = new Map()

export const html = async (strings: TemplateStringsArray, ...values: any[]) =>
	Promise.resolve(_html(strings, ...values))

export const component = async (
	template: Promise<TemplateResult> | TemplateResult
) => {
	const token = random()
	templates.set(token, template)
	return html`<ullr-shdw t$='${token}'></ullr-shdw>`
}

window.customElements.define(
	'ullr-shdw',
	class extends UllrElement {
		token: string
		template: Promise<TemplateResult> | TemplateResult | undefined
		static get observedAttributes() {
			return ['t']
		}
		attributeChangedCallback(_, __, next) {
			this.token = next
			this.template = templates.get(next)
			if (this.connected) {
				this._render().catch()
			}
		}
		connectedCallback() {
			this._render().catch()
		}
		disconnectedCallback() {
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
