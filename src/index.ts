import { html as _html, render } from 'lit-html/lib/lit-extended'
import { TemplateResult } from 'lit-html'
import { random } from './lib/element'

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
	class extends HTMLElement {
		token: string
		template: Promise<TemplateResult> | TemplateResult | undefined
		static get observedAttributes() {
			return ['t']
		}
		attributeChangedCallback(_, __, next) {
			this.token = next
			this.template = templates.get(next)
		}
		async connectedCallback() {
			render(
				(await this.template) || _html``,
				this.shadowRoot || this.attachShadow({ mode: 'open' })
			)
		}
		disconnectedCallback() {
			if (!this.template) {
				return
			}
			templates.delete(this.token)
		}
	}
)
