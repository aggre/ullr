import { Observable, Subscription } from 'rxjs'
import { TemplateResult, NodePart, directive } from 'lit-html'
import { html } from 'lit-html/lib/lit-extended'
import { random, UllrElement, render } from '../lib/element'

const subscriptions: Map<string, Subscription> = new Map()

window.customElements.define(
	'ullr-sbsc',
	class extends UllrElement {
		token: string
		subscription: Subscription | undefined
		static get observedAttributes() {
			return ['t']
		}
		attributeChangedCallback(_, __, next) {
			this.token = next
			this.subscription = subscriptions.get(next)
			if (this.connected) {
				this._render()
			}
		}
		connectedCallback() {
			this._render()
		}
		disconnectedCallback() {
			if (!this.subscription) {
				return
			}
			this.subscription.unsubscribe()
			subscriptions.delete(this.token)
		}
		private _render() {
			render(html`<slot></slot>`, this)
		}
	}
)

export const subscribe = <T>(
	observable: Observable<T>,
	template: (x: T) => Promise<TemplateResult> | TemplateResult,
	defaultContent?: Promise<TemplateResult> | TemplateResult
) =>
	directive((part: NodePart) => {
		const token = random()
		subscriptions.set(
			token,
			observable.subscribe(x =>
				part.setValue(html`<ullr-sbsc t$='${token}'>${template(x)}</ullr-sbsc>`)
			)
		)
		if (defaultContent) {
			part.setValue(defaultContent)
		}
	})
