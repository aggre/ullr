// Tslint:disable:no-unnecessary-type-annotation
import { directive, html, TemplateResult, Part } from 'lit-html'
import equals from 'ramda/es/equals'
import { random, render, UllrElement } from '../lib/element'
import { DirectiveFunction } from '.'
import { define } from '../lib/define'

const templates: Map<string, TemplateResult> = new Map()
const parts: WeakMap<Part, TemplateResult> = new WeakMap()

define(class extends UllrElement {
	token: string
	template: TemplateResult | undefined
	static get is(): string {
		return 'ullr-shdw'
	}

	static get observedAttributes(): string[] {
		return ['t']
	}

	attributeChangedCallback(
		_: string,
		prev: string | null,
		next: string | null
	): void {
		this.token = next as string
		if (next !== null) {
			this.template = templates.get(next)
		}

		if (prev !== null) {
			templates.delete(prev)
		}

		if (this.connected) {
			this._render()
		}
	}

	connectedCallback(): void {
		super.connectedCallback()
		this._render()
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()
		templates.delete(this.token)
	}

	private _render(): void {
		if (this.template === undefined) {
			return
		}

		render(this.template, this)
	}
})

const componentFn = (template: TemplateResult): TemplateResult => {
	const token = random()
	templates.set(token, template)
	return html`
		<ullr-shdw t="${token}"></ullr-shdw>
	`
}

const f = (template: TemplateResult): DirectiveFunction => (
	part: Part
): void => {
	const prev = parts.get(part)
	if (prev !== undefined && equals(prev, template)) {
		return
	}

	parts.set(part, template)
	part.setValue(componentFn(template))
}

export const component = directive(f)
