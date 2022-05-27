import { TemplateResult } from 'lit'
import { DirectiveResult } from 'lit/directive'
import { render, UllrElement } from './lib/element'
import type { ReadonlyTuple, Writable } from 'type-fest'

export type AttributeValue = string | undefined
export type Templatable = TemplateResult | DirectiveResult

export function createCustomElements<Props extends ReadonlyTuple<never, 0>>(
	template: (props: Props) => TemplateResult
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 1>,
	Attrs extends Writable<ReadonlyTuple<string, 1>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 2>,
	Attrs extends Writable<ReadonlyTuple<string, 2>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 3>,
	Attrs extends Writable<ReadonlyTuple<string, 3>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 4>,
	Attrs extends Writable<ReadonlyTuple<string, 4>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 5>,
	Attrs extends Writable<ReadonlyTuple<string, 5>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 6>,
	Attrs extends Writable<ReadonlyTuple<string, 6>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 7>,
	Attrs extends Writable<ReadonlyTuple<string, 7>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 8>,
	Attrs extends Writable<ReadonlyTuple<string, 8>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 9>,
	Attrs extends Writable<ReadonlyTuple<string, 9>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 10>,
	Attrs extends Writable<ReadonlyTuple<string, 10>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 11>,
	Attrs extends Writable<ReadonlyTuple<string, 11>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements<
	Props extends ReadonlyTuple<AttributeValue, 12>,
	Attrs extends Writable<ReadonlyTuple<string, 12>>
>(
	template: (props: Props) => TemplateResult,
	observedAttributes: Attrs
): typeof UllrElement

export function createCustomElements(
	template: (props: unknown) => TemplateResult,
	observedAttributes: [undefined] = [undefined]
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
			// eslint-disable-next-line @typescript-eslint/ban-types
			_: string | null,
			// eslint-disable-next-line @typescript-eslint/ban-types
			next: string | null
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
