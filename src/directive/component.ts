import { html, NodePart, directive } from 'lit-html'
import { render } from '../lib/element'
import { AsyncOrSyncTemplateResult } from '..'

window.customElements.define(
	'ullr-shdw',
	class extends HTMLElement {
		template: AsyncOrSyncTemplateResult
		async connectedCallback() {
			if (!this.template) {
				return
			}
			render(await this.template, this)
		}
	}
)

export const componentFn = (template: AsyncOrSyncTemplateResult) => {
	return html`<ullr-shdw .template='${template}'></ullr-shdw>`
}

export const component = (template: AsyncOrSyncTemplateResult) =>
	directive((part: NodePart) => {
		part.setValue(componentFn(template))
		part.commit()
	})
