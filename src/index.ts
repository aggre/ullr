import { TemplateResult } from 'lit'
import { DirectiveResult } from 'lit/directive'
import { render, UllrElement } from './lib/element'

type Props = Array<string | undefined>
export type Templatable = TemplateResult | DirectiveResult

export function createCustomElements<Attrs extends readonly [undefined]>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes?: Attrs
): typeof UllrElement

export function createCustomElements<Attrs extends readonly [string]>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<Attrs extends readonly [string, string]>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [string, string, string]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [string, string, string, string]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [string, string, string, string]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [string, string, string, string, string]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [string, string, string, string, string, string]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [
		string,
		string,
		string,
		string,
		string,
		string,
		string
	]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string
	]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string
	]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string
	]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string
	]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Attrs extends readonly [
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string
	]
>(
	template: (props: Attrs) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements(
	template: (props: unknown) => TemplateResult,
	observedAttributes: [undefined] = [undefined]
): unknown {
	return class extends UllrElement {
		props: Props
		constructor() {
			super()
			this.props = []
		}

		static get observedAttributes(): typeof observedAttributes {
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
}
