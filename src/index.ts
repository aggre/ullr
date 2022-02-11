import { TemplateResult } from 'lit'
import { DirectiveResult } from 'lit/directive'
import { render, UllrElement } from './lib/element'

type Props = Array<string | undefined>
export type Templatable = TemplateResult | DirectiveResult

export const customElements = (
	template: (props: Props) => TemplateResult,
	observedAttributes: string[] = []
): typeof UllrElement =>
	class extends UllrElement {
		props: Props
		constructor() {
			super()
			this.props = []
		}

		static get observedAttributes(): string[] {
			return observedAttributes
		}

		attributeChangedCallback(
			name: string,
			_: string | undefined,
			next: string | undefined
		): void {
			const index = observedAttributes.findIndex((n) => n === name)
			this.props[index] = next
			if (this.connected) {
				this._render()
			}
		}

		connectedCallback(): void {
			super.connectedCallback()
			this._render()
		}

		_render(): void {
			render(template(this.props), this)
		}
	}
