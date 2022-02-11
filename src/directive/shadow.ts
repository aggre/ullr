// Tslint:disable:no-unnecessary-type-annotation
import { html } from 'lit'
import { Directive, PartInfo, directive } from 'lit/directive.js'
import { equals } from 'ramda'
import { random, render, UllrElement } from '../lib/element'
import { define } from '../lib/define'
import { isNodeEnv } from '../lib/is-node-env'
import { Templatable } from '..'

const templates: Map<string, Templatable> = new Map<string, Templatable>()

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
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.token = next!
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

		render(html`${this.template}`, this)
	}
})

const innerTemplate = isNodeEnv()
	? (token: string, inner: Templatable) =>
			html` <ullr-shdw t="${token}">${inner}</ullr-shdw> `
	: (token: string) => html` <ullr-shdw t="${token}"></ullr-shdw> `

class Shadow extends Directive {
	prev: Templatable | undefined

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(partInfo: PartInfo) {
		super(partInfo)
	}

	render(inner: Templatable) {
		if (this.prev !== undefined && equals(this.prev, inner)) {
			return
		}

		this.prev = inner
		const t = random()
		templates.set(t, inner)
		return innerTemplate(t, inner)
	}
}

export const shadow = directive(Shadow)
