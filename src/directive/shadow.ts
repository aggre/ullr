// Tslint:disable:no-unnecessary-type-annotation
import { html } from 'lit'
import { Directive, type PartInfo, directive } from 'lit/directive.js'
import { render, UllrElement } from '../lib/element'
import { define } from '../lib/define'
import { isNodeEnv } from '../lib/is-node-env'
import { type Templatable } from '..'

define(class extends UllrElement {
	_template: Templatable | undefined
	static get is(): string {
		return 'ullr-shdw'
	}

	get template(): Templatable | undefined {
		return this._template
	}

	set template(tmp: Templatable | undefined) {
		this._template = tmp
		this._render()
	}

	connectedCallback(): void {
		super.connectedCallback()
		this._render()
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()
	}

	private _render(): void {
		if (this.template === undefined) {
			return
		}

		render(html`${this.template}`, this)
	}
})

const innerTemplate = isNodeEnv()
	? (inner: Templatable) => html` <ullr-shdw>${inner}</ullr-shdw> `
	: (inner: Templatable) => html` <ullr-shdw .template="${inner}"></ullr-shdw> `

class Shadow extends Directive {
	prev: Templatable | undefined

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(partInfo: PartInfo) {
		super(partInfo)
	}

	render(inner: Templatable) {
		return innerTemplate(inner)
	}
}

export const shadow = directive(Shadow)
