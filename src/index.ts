import { type TemplateResult } from 'lit'
import { type DirectiveResult } from 'lit/directive'
import { render, UllrElement } from './lib/element'
import type { FixedLengthArray, ReadonlyTuple } from 'type-fest'

export type AttributeValue = string | undefined
export type Templatable = TemplateResult | DirectiveResult

export function createCustomElements<Props extends ReadonlyTuple<never, 0>>(
	template: (props: Props) => TemplateResult,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 1>,
	Attrs extends FixedLengthArray<string, 1>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 2>,
	Attrs extends FixedLengthArray<string, 2>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 3>,
	Attrs extends FixedLengthArray<string, 3>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 4>,
	Attrs extends FixedLengthArray<string, 4>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 5>,
	Attrs extends FixedLengthArray<string, 5>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 6>,
	Attrs extends FixedLengthArray<string, 6>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 7>,
	Attrs extends FixedLengthArray<string, 7>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 8>,
	Attrs extends FixedLengthArray<string, 8>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 9>,
	Attrs extends FixedLengthArray<string, 9>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 10>,
	Attrs extends FixedLengthArray<string, 10>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 11>,
	Attrs extends FixedLengthArray<string, 11>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 12>,
	Attrs extends FixedLengthArray<string, 12>,
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs,
): typeof UllrElement

export function createCustomElements(
	template: (props: unknown) => TemplateResult,
	observedAttributes: [undefined] = [undefined],
): unknown {
	return class extends UllrElement {
		private _props: AttributeValue[]
		constructor() {
			super()
			this._props = []
		}

		static get observedAttributes(): typeof observedAttributes {
			return [...observedAttributes]
		}

		attributeChangedCallback(
			name: string,
			_: string | null,
			next: string | null,
		): void {
			const index = observedAttributes?.findIndex((n) => n === name)
			if (index !== undefined) {
				this._props = [...this._props]
				this._props[index] = next ?? undefined
			}

			if (this.connected) {
				this._render()
			}
		}

		connectedCallback(): void {
			super.connectedCallback()
			this._render()
		}

		_render(): void {
			render(template([...this._props]), this)
		}
	}
}
