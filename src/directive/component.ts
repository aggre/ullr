import { html, NodePart, directive, TemplateResult } from 'lit-html'
import { render } from '../lib/element'

window.customElements.define(
	'ullr-shdw',
	class extends HTMLElement {
		template: TemplateResult
		connectedCallback() {
			if (!this.template) {
				return
			}
			render(this.template, this)
		}
	}
)

export const componentFn = (template: TemplateResult) => {
	return html`<ullr-shdw .template='${template}'></ullr-shdw>`
}

export const component = (template: TemplateResult) =>
	directive((part: NodePart) => {
		part.setValue(componentFn(template))
		part.commit()
	})
