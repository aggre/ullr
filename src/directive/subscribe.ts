import { Observable, Subscription } from 'rxjs'
import { html, NodePart, directive } from 'lit-html'
import { random, UllrElement, render } from '../lib/element'
import { AsyncOrSyncTemplateResult } from '..'

const subscriptions = new Map()

window.customElements.define(
	'ullr-sbsc',
	class extends UllrElement {
		token: string
		subscription: Subscription
		static get observedAttributes() {
			return ['t']
		}
		attributeChangedCallback(_, prev, next) {
			this.token = next
			this.subscription = subscriptions.get(next)
			if (prev) {
				subscriptions.delete(prev)
			}
			if (this.connected) {
				this._render()
			}
		}
		connectedCallback() {
			super.connectedCallback()
			this._render()
		}
		disconnectedCallback() {
			super.disconnectedCallback()
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
	template: (x: T) => AsyncOrSyncTemplateResult,
	defaultContent?: AsyncOrSyncTemplateResult
) =>
	directive((part: NodePart) => {
		const token = random()
		subscriptions.set(
			token,
			observable.subscribe(x => {
				part.setValue(html`<ullr-sbsc t='${token}'>${template(x)}</ullr-sbsc>`)
				part.commit()
			})
		)
		if (defaultContent) {
			part.setValue(defaultContent)
			part.commit()
		}
	})
