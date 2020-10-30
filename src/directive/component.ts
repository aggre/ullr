// Tslint:disable:no-unnecessary-type-annotation
import { directive, html, Part } from 'lit-html'
import equals from 'ramda/es/equals'
import { random, render, UllrElement } from '../lib/element'
import { DirectiveFunction } from '.'
import { define } from '../lib/define'
import { isNodeEnv } from '../lib/is-node-env'
import { Templatable } from '..'
import { toTemplate } from '../lib/to-template'

const templates: Map<string, Templatable> = new Map()
const parts: WeakMap<Part, Templatable> = new WeakMap()

define(class extends UllrElement {
	token: string
	template: Templatable | undefined
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

		render(toTemplate(this.template), this)
	}
})

const f = ((
	innerTemplate: (token: string, inner: Templatable) => Templatable
) => (template: Templatable): DirectiveFunction => (part: Part): void => {
	const prev = parts.get(part)
	if (prev !== undefined && equals(prev, template)) {
		return
	}

	parts.set(part, template)
	const token = random()
	templates.set(token, template)
	part.setValue(innerTemplate(token, template))
	part.commit()
})(
	isNodeEnv()
		? (token, inner) => html` <ullr-shdw t="${token}">${inner}</ullr-shdw> `
		: (token) => html` <ullr-shdw t="${token}"></ullr-shdw> `
)

export const component = directive(f)
