import { TemplateResult } from 'lit-html'
import { render, UllrElement } from './lib/element'
import { componentFn } from './directive/component'

export type AsyncOrSyncTemplateResult = TemplateResult | Promise<TemplateResult>

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

export const component = <T extends AsyncOrSyncTemplateResult>(template: T) => {
	console.info(
		'This function is deprecated. The recommended API is the `component` directive function in "ullr/directive".'
	)
	return componentFn(template)
}
